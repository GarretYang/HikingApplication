package com.example.hiking_2.ui.home

import android.app.Activity
import android.content.Intent
import android.graphics.Color
import android.os.Build
import android.os.Bundle
import android.text.Html
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.*
import androidx.annotation.RequiresApi
import androidx.core.view.marginTop
import androidx.fragment.app.Fragment
import androidx.lifecycle.Observer
import androidx.lifecycle.ViewModelProviders
import com.android.volley.Request
import com.android.volley.Response
import com.android.volley.toolbox.JsonArrayRequest
import com.android.volley.toolbox.Volley
import com.example.hiking_2.R
import com.example.hiking_2.ui.home.SingleTheme.Companion.themeToPass
import com.example.hiking_2.ui.search.Search
import com.example.hiking_2.ui.search.empty_search
import com.google.android.material.card.MaterialCardView
import com.squareup.picasso.Picasso
import kotlinx.android.synthetic.main.activity_report_details.*
import kotlinx.android.synthetic.main.activity_report_details.view.*
import kotlinx.android.synthetic.main.fragment_home.*
import kotlinx.android.synthetic.main.fragment_home.view.*
import org.json.JSONArray

class HomeFragment : Fragment() {

    private lateinit var homeViewModel: HomeViewModel

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        homeViewModel =
            ViewModelProviders.of(this).get(HomeViewModel::class.java)
        val root = inflater.inflate(R.layout.fragment_home, container, false)
        getThemes()


        val searchPage = Intent(context, empty_search::class.java)
        val searchhh: SearchView = root.findViewById(R.id.searchView)

        searchhh.setOnClickListener {
            startActivity(searchPage)
        }


        return root
    }

    @RequiresApi(Build.VERSION_CODES.JELLY_BEAN_MR1)
    private fun getThemes() {

        // Instantiate the RequestQueue.
        val queue = Volley.newRequestQueue(this.context)
//        val url = "https://aptproject-255903.appspot.com/json"
        val url = "http://10.0.2.2:8000/json"
        val jsonGetRequest = JsonArrayRequest(Request.Method.GET, url, null,
            Response.Listener<JSONArray> { response ->
                var idx = 0
                while (idx < response.length()) {
                    val themeJson = response.getJSONObject(idx)

                    var newCard = RelativeLayout(this.theme_linear_layout.context)
                    var newCardTextView = TextView(newCard.context)
                    var newImg = ImageView(newCard.context)
                    val basicPhotoUrl = "https://aptproject-255903.appspot.com/photo?photoId="
                    if (themeJson.has("feature_img_id") && themeJson.getJSONObject("feature_img_id").length() != 0) {
                        var photoID = themeJson.getJSONObject("feature_img_id").getString("\$oid")
                        var PhotoUrl = basicPhotoUrl + photoID
                        Picasso
                            .get()
                            .load(PhotoUrl)
                            .into(newImg)
                    } else {
                        Picasso
                            .get()
                            .load("http://denrakaev.com/wp-content/uploads/2015/03/no-image-800x511.png")
                            .into(newImg)
                    }
                    var param: RelativeLayout.LayoutParams = RelativeLayout.LayoutParams(RelativeLayout.LayoutParams.MATCH_PARENT,
                        RelativeLayout.LayoutParams.WRAP_CONTENT)
                    param.topMargin = 50
                    param.bottomMargin = 100
                    newCard.addView(newCardTextView)
                    newCard.addView(newImg)
                    newCard.layoutParams = param
                    newCard.minimumHeight = 200
                    newCardTextView.text = themeJson.getString("feature_name")
                    newImg.layoutParams.width = RelativeLayout.LayoutParams.MATCH_PARENT
                    newImg.layoutParams.height = RelativeLayout.LayoutParams.WRAP_CONTENT
                    newImg.scaleType = ImageView.ScaleType.FIT_XY
                    newImg.adjustViewBounds = true

                    newImg.setOnClickListener() {
                        val singlePage = Intent(context, SingleTheme::class.java)

                        val toTheme = newCardTextView.text.toString()
                        println(toTheme)
                        singlePage.putExtra(themeToPass, newCardTextView.text.toString())

                        // Start new activity
                        startActivity(singlePage)
                    }

                    //generate id
                    newImg.id = ImageView.generateViewId()
                    newCardTextView.id = TextView.generateViewId()

                    //change layout
                    var param1 = RelativeLayout.LayoutParams(
                        ViewGroup.LayoutParams.WRAP_CONTENT,
                        ViewGroup.LayoutParams.WRAP_CONTENT
                    )
                    param1.addRule(RelativeLayout.BELOW, newImg.id)
                    param1.leftMargin = 50
                    newCardTextView.setLayoutParams(param1)
                    newCardTextView.textSize = 30F

                    param.bottomMargin = 20

                    theme_linear_layout.addView(newCard)

                    ++idx
                }

            },
            Response.ErrorListener { error ->
                // TODO: Handle error
                println(error)
            }
        )

        queue.add(jsonGetRequest)
    }
}