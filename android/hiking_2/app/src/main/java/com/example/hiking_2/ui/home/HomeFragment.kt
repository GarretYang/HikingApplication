package com.example.hiking_2.ui.home

import android.graphics.Color
import android.os.Bundle
import android.text.Html
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.LinearLayout
import android.widget.RelativeLayout
import android.widget.TextView
import androidx.core.view.marginTop
import androidx.fragment.app.Fragment
import androidx.lifecycle.Observer
import androidx.lifecycle.ViewModelProviders
import com.android.volley.Request
import com.android.volley.Response
import com.android.volley.toolbox.JsonArrayRequest
import com.android.volley.toolbox.Volley
import com.example.hiking_2.R
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
//        val textView: TextView = root.findViewById(R.id.theme_page_title)
        getThemes()
//        homeViewModel.text.observe(this, Observer {
//            textView.text = it
//        })
        return root
    }

    private fun getThemes() {

        // Instantiate the RequestQueue.
        val queue = Volley.newRequestQueue(this.context)
        val url = "https://aptproject-255903.appspot.com/json"

        val jsonGetRequest = JsonArrayRequest(Request.Method.GET, url, null,
            Response.Listener<JSONArray> { response ->
                var idx = 0
                while (idx < response.length()) {
                    val themeJson = response.getJSONObject(idx)

                    var newCard = MaterialCardView(this.theme_linear_layout.context)
                    var newCardTextView = TextView(newCard.context)
                    var newImg = ImageView(newCard.context)
                    val basicPhotoUrl = "https://aptproject-255903.appspot.com/photo?photoId="
                    var photoID = themeJson.getJSONObject("feature_img_id").getString("\$oid")
                    var PhotoUrl = basicPhotoUrl + photoID
                    var param: RelativeLayout.LayoutParams = RelativeLayout.LayoutParams(RelativeLayout.LayoutParams.MATCH_PARENT,
                        RelativeLayout.LayoutParams.WRAP_CONTENT)
                    param.topMargin = 25
                    param.bottomMargin = 20
                    newCard.addView(newCardTextView)
                    newCard.addView(newImg)
                    newCard.layoutParams = param
                    newCard.minimumHeight = 200
                    newCardTextView.text = themeJson.getString("feature_name")
                    Picasso
                        .get()
                        .load(PhotoUrl)
                        .into(newImg)
                    newImg.layoutParams.width = RelativeLayout.LayoutParams.MATCH_PARENT
                    newImg.layoutParams.height = RelativeLayout.LayoutParams.WRAP_CONTENT
                    newImg.scaleType = ImageView.ScaleType.FIT_XY
                    newImg.adjustViewBounds = true

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