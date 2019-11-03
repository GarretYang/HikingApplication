package com.example.hiking_2.ui

import android.app.Activity
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.location.Location
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import android.view.View
import androidx.core.app.ActivityCompat

import com.google.android.gms.maps.CameraUpdateFactory
import com.google.android.gms.maps.GoogleMap
import com.google.android.gms.maps.OnMapReadyCallback
import com.google.android.gms.maps.SupportMapFragment
import com.google.android.gms.maps.model.LatLng
import com.google.android.gms.maps.model.MarkerOptions
import com.google.android.gms.location.FusedLocationProviderClient
import com.google.android.gms.location.LocationServices
import com.google.android.gms.maps.model.Marker
import com.android.volley.Request
import com.android.volley.Response
import com.android.volley.toolbox.JsonArrayRequest
import com.android.volley.toolbox.Volley
import com.example.hiking_2.R
import com.example.hiking_2.ReportDetailsActivity
import kotlinx.android.synthetic.main.layout_custom_map_marker.view.*
import org.json.JSONArray


class MapsActivity : AppCompatActivity(), GoogleMap.OnMarkerClickListener,
    OnMapReadyCallback,
    GoogleMap.OnInfoWindowClickListener {

    private lateinit var mMap: GoogleMap

    private lateinit var lastLocation: Location

    private lateinit var fusedLocationClient: FusedLocationProviderClient

    private val TAG = "MapsActivity"

    companion object {
        private const val LOCATION_PERMISSION_REQUEST_CODE = 1
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_maps)
        // Obtain the SupportMapFragment and get notified when the map is ready to be used.
        val mapFragment = supportFragmentManager
            .findFragmentById(R.id.map) as SupportMapFragment
        mapFragment.getMapAsync(this)
        fusedLocationClient = LocationServices.getFusedLocationProviderClient(this)
    }

    /**
     * Manipulates the map once available.
     * This callback is triggered when the map is ready to be used.
     * This is where we can add markers or lines, add listeners or move the camera. In this case,
     * we just add a marker near Sydney, Australia.
     * If Google Play services is not installed on the device, the user will be prompted to install
     * it inside the SupportMapFragment. This method will only be triggered once the user has
     * installed Google Play services and returned to the app.
     */
    override fun onMapReady(googleMap: GoogleMap) {
        mMap = googleMap

        mMap.uiSettings.isZoomControlsEnabled = true
        mMap.setOnMarkerClickListener(this)
        mMap.setOnInfoWindowClickListener(this);
        setUpMap()
    }

    override fun onMarkerClick(p0: Marker?): Boolean {
        Log.i(TAG, p0?.position?.latitude.toString())
        Log.i(TAG, p0?.position?.longitude.toString())

        return false
    }

    override fun onInfoWindowClick(p0: Marker?) {
        transitionToReportDetails(p0)
    }


    fun setUpMap() {
        // Check the permission
        if (ActivityCompat.checkSelfPermission(this,
                android.Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(this,
                arrayOf(android.Manifest.permission.ACCESS_FINE_LOCATION), LOCATION_PERMISSION_REQUEST_CODE)
            return
        }


        mMap.isMyLocationEnabled = true
        fusedLocationClient.lastLocation.addOnSuccessListener(this) { location ->
            // Got last known location. In some rare situations this can be null.
            // 3
            if (location != null) {
                lastLocation = location
                val currentLatLng = LatLng(location.latitude, location.longitude)

                // Make a HTTP GET request to retrieve all the reports' locations
                val queue = Volley.newRequestQueue(this)
                val url = "https://aptproject-255903.appspot.com/locations"

                val jsonGetRequest = JsonArrayRequest(Request.Method.GET, url, null,
                    Response.Listener<JSONArray> {response ->
                        Log.i(TAG, response.toString())
                        var idx = 0
                        while (idx < response.length()) {

                            val reportJson = response.getJSONObject(idx)

                            // TODO: Change Flask API for returning photos array
                            val singleReport = InfoWindowData(
                                reportJson.getJSONObject("location").getDouble("latitude"),
                                reportJson.getJSONObject("location").getDouble("longitude"),
                                reportJson.getJSONObject("location").getString("name"),
                                reportJson.getString("date_in"),
                                reportJson.getString("feature_name"),
                                reportJson.getJSONObject("_id").getString("\$oid"),
                                reportJson.getString("description"),
                                reportJson.getJSONObject("user_id").getString("\$oid"),
                                reportJson.getJSONArray("photos")
                            )
                            placeMarkerOnMap(singleReport)
                            ++idx
                        }
                    },
                    Response.ErrorListener {error ->
                        Log.e(TAG, error.toString())
                    })

                queue.add(jsonGetRequest)


                // Add marker for current location
                mMap.animateCamera(CameraUpdateFactory.newLatLngZoom(currentLatLng, 12f))
                mMap.addMarker(MarkerOptions().position(LatLng(lastLocation.latitude, lastLocation.longitude)))
            }
        }
    }



    // Async callback function
    override fun onRequestPermissionsResult(requestCode: Int,
                                            permissions: Array<String>, grantResults: IntArray) {
        when (requestCode) {
            LOCATION_PERMISSION_REQUEST_CODE -> {

                if (grantResults.isEmpty() || grantResults[0] != PackageManager.PERMISSION_GRANTED) {

                    Log.i(TAG, "Permission has been denied by user")
                } else {
                    Log.i(TAG, "Permission has been granted by user")
                }
            }
        }
    }


    // Set marker for the input location
    private fun placeMarkerOnMap(info: InfoWindowData) {
        // 1
        val markerOptions = MarkerOptions().position(LatLng(info.mLocationLat, info.mLocationLng))

        val customInfoWindow = CustomInfoWindowGoogleMap(this)

        mMap!!.setInfoWindowAdapter(customInfoWindow)


        // 2
        val mark = mMap.addMarker(markerOptions)
        mark.tag = info
        mark.showInfoWindow()
    }

    // Transition function to report detail page
    private fun transitionToReportDetails(p0: Marker?) {

        val mInfoWindow: InfoWindowData? = p0?.tag as InfoWindowData?

        val reportDetailsIntent = Intent(this, ReportDetailsActivity::class.java)

        val photoIdArray = arrayListOf<String>()

        var idx = 0
        while (idx < mInfoWindow?.mLocationPhotos!!.length()) {
            photoIdArray.add(mInfoWindow?.mLocationPhotos.getJSONObject(idx).getString("\$oid"))
            ++idx
        }

        Log.i(TAG, mInfoWindow?.mLocatioName.toString())
        Log.i(TAG, mInfoWindow?.mLocationOid.toString())

        reportDetailsIntent.putExtra(ReportDetailsActivity.LOCATION_REPORT_ID, mInfoWindow?.mLocationOid)

        reportDetailsIntent.putExtra(ReportDetailsActivity.LOCATION_NAME, mInfoWindow?.mLocatioName)

        reportDetailsIntent.putExtra(ReportDetailsActivity.LOCATION_DATE, mInfoWindow?.mLocationDate)

        reportDetailsIntent.putExtra(ReportDetailsActivity.LOCATION_THEME, mInfoWindow?.mLocationTheme)

        reportDetailsIntent.putExtra(ReportDetailsActivity.LOCATION_DESC, mInfoWindow?.mLocationDesc)

        reportDetailsIntent.putStringArrayListExtra(ReportDetailsActivity.LOCATION_PHOTOS, photoIdArray)

        // Start new activity
        startActivity(reportDetailsIntent)
    }

}

data class InfoWindowData(val mLocationLat: Double,      // Location latitude
                          val mLocationLng: Double,      // Location longitude
                          val mLocatioName: String,      // Location name
                          val mLocationDate: String,     // Date of recording this report
                          val mLocationTheme: String,    // Location theme
                          val mLocationOid: String,      // Object ID of the report in Mongodb
                          val mLocationDesc: String,     // Location description
                          val mLocationUserId: String,   // User who creates the report
                          val mLocationPhotos: JSONArray // Photo ids attached to the report
)


class CustomInfoWindowGoogleMap(val context: Context) : GoogleMap.InfoWindowAdapter {

    // Google map first calls this function
    // If return null, further call getInfoContents
    override fun getInfoWindow(p0: Marker?): View? {
        return null
    }


    override fun getInfoContents(p0: Marker?): View {

        val mInfoView = (context as Activity).layoutInflater.inflate(R.layout.layout_custom_map_marker, null)
        val mInfoWindow: InfoWindowData? = p0?.tag as InfoWindowData?

        mInfoView.report_date.setText("Date: " + mInfoWindow?.mLocationDate)
        mInfoView.report_name.setText("Location name: " + mInfoWindow?.mLocatioName)
        mInfoView.report_theme.setText("Theme: " + mInfoWindow?.mLocationTheme)
        mInfoView.report_desc.setText("Description: " + mInfoWindow?.mLocationDesc)
        return mInfoView
    }

}
