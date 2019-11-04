package com.example.hiking_2.ui.add

import android.app.Activity
import android.content.ContentValues.TAG
import android.content.Intent
import android.graphics.Bitmap
import android.os.Bundle
import android.provider.MediaStore
import android.util.Log
import android.view.ViewGroup
import android.view.LayoutInflater
import android.view.View
import androidx.fragment.app.Fragment
import androidx.lifecycle.ViewModelProviders
import com.android.volley.Request
import com.android.volley.Response
import com.android.volley.toolbox.JsonObjectRequest
import com.android.volley.toolbox.Volley
import com.example.hiking_2.R
import kotlinx.android.synthetic.main.fragment_create_report.*
import org.json.JSONArray
import org.json.JSONObject
import android.util.Base64
import android.widget.*
import com.android.volley.toolbox.JsonArrayRequest
import com.google.android.material.chip.ChipGroup
import com.squareup.picasso.Picasso
import kotlinx.android.synthetic.main.fragment_home.*
import java.io.ByteArrayOutputStream


class CreateReportFragment : Fragment(), AdapterView.OnItemSelectedListener {

    val REQUEST_TAKE_PHOTO = 0
    val REQUEST_IMAGE_CAPTURE = 1
    var image = Bitmap.createBitmap(100,100,Bitmap.Config.ARGB_8888)
    var selected_feature = ""

    private lateinit var createReportViewModel: CreateReportViewModel

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        // set up variables
        createReportViewModel = ViewModelProviders.of(this).get(CreateReportViewModel::class.java)
        val root = inflater.inflate(R.layout.fragment_create_report, container, false)
        val createReport: Button = root.findViewById(R.id.submit_new_report)
        val cameraButton: Button = root.findViewById(R.id.camera)
        val galleryButton: Button = root.findViewById(R.id.gallery)

        createReport.setOnClickListener { sendReport(root) }
        cameraButton.setOnClickListener { dispatchTakePictureIntent() }
        galleryButton.setOnClickListener { dispatchGetGalleryIntent() }

        val spinner: Spinner = root.findViewById(R.id.select_feature)
        spinner.onItemSelectedListener = this

        // Create an ArrayAdapter using the string array and a default spinner layout

        setupSpinner(root, spinner)

        return root
    }

    override fun onItemSelected(parent: AdapterView<*>, view: View, pos: Int, id: Long) {
        // An item was selected. You can retrieve the selected item using
        selected_feature = parent.getItemAtPosition(pos).toString()
    }

    override fun onNothingSelected(parent: AdapterView<*>) {
        // Another interface callback
        selected_feature = ""
    }

    private fun setupSpinner(view: View, spinner: Spinner) {

        var features = ArrayList<String>()

        val queue = Volley.newRequestQueue(context)
        val url = "http://10.0.2.2:5000/json"

        val jsonGetRequest = JsonArrayRequest(Request.Method.GET, url, null,
            Response.Listener<JSONArray> { response ->
                var idx = 0
                while (idx < response.length()) {
                    val themeJson = response.getJSONObject(idx)
                    features.add(themeJson.getString("feature_name"))
                    Log.i("FEATURE", features[idx])
                    ++idx
                }

                ArrayAdapter<String> (
                    view.context,
                    android.R.layout.simple_spinner_item,
                    features.toTypedArray()
                ).also { adapter ->
                    adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
                    spinner.adapter = adapter
                }
            },
            Response.ErrorListener { error ->
                // TODO: Handle error
                println(error)
            }
        )

        queue.add(jsonGetRequest)
        Log.i(TAG, features.toString())
    }

    private fun sendReport(view: View) : Boolean {

        // Instantiate the RequestQueue.
        val queue = Volley.newRequestQueue(context)
        val url = "http://10.0.2.2:5000/newcreatereportjson"

        val select_date = view.findViewById<EditText>(R.id.select_date)
        val enter_description = view.findViewById<EditText>(R.id.enter_description)
        val enter_location = view.findViewById<EditText>(R.id.enter_location)
        val select_tags = view.findViewById<ChipGroup>(R.id.select_tags)

        //Must select feature, location, date
        if(selected_feature.isEmpty() || enter_location.text.isEmpty() || select_date.text.isEmpty() || enter_location.text.isEmpty()) {
            return false
        }

        val feature = selected_feature
        val date = select_date.text.toString()
        val location = enter_location.text.toString()
        var description = "No description provided."

        if(!enter_description.text.isEmpty()) {
            description = enter_description.text.toString()
        }

        //TODO Get tags from chip groups and get user name and email from Login

        val name = "Dylan Bray"
        val email = "dfbray@utexas.edu"
        val tags = JSONArray(setOf("Wet", "Cold"))

        //base64 encode image
        val byteArrayOutputStream = ByteArrayOutputStream()
        image.compress(Bitmap.CompressFormat.PNG, 100, byteArrayOutputStream)
        val byteArray = byteArrayOutputStream.toByteArray()
        val encoded = Base64.encodeToString(byteArray, Base64.DEFAULT)
        val photos = JSONArray(setOf(encoded))

        var params = JSONObject()
        params.put("feature", feature)
        params.put("date", date)
        params.put("description", description)
        params.put("location", location)
        params.put("tags", tags)
        params.put("photos", photos)
        params.put("name", name)
        params.put("email", email)

        var jsonObjectRequest = JsonObjectRequest(
            Request.Method.POST, url, params,
            Response.Listener { response ->
                Toast.makeText(view.context, "Response: %s".format(response.toString()), Toast.LENGTH_LONG)
            },
            Response.ErrorListener { error ->
                Log.e("POST-REQUEST", error.toString())
            }
        )

        queue.add(jsonObjectRequest)

        return true
    }

    private fun dispatchTakePictureIntent() {
        Intent(MediaStore.ACTION_IMAGE_CAPTURE).also { takePictureIntent ->
            takePictureIntent.resolveActivity(activity?.packageManager)?.also {
                startActivityForResult(takePictureIntent, REQUEST_TAKE_PHOTO)
            }
        }
    }

    private fun dispatchGetGalleryIntent() {
        val pickPhoto = Intent(Intent.ACTION_GET_CONTENT, MediaStore.Images.Media.EXTERNAL_CONTENT_URI)
        startActivityForResult(pickPhoto, REQUEST_IMAGE_CAPTURE)
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)

        if (requestCode == REQUEST_IMAGE_CAPTURE && resultCode == Activity.RESULT_OK) {
            val imageBitmap = MediaStore.Images.Media.getBitmap(context?.contentResolver, data?.data)
            thumbnail_view.setImageBitmap(imageBitmap)
            image = imageBitmap
        }

        else if (requestCode == REQUEST_TAKE_PHOTO && resultCode == Activity.RESULT_OK) {
            val imageBitmap = data?.extras?.get("data") as Bitmap
            thumbnail_view.setImageBitmap(imageBitmap)
            image = imageBitmap
        }
    }
}