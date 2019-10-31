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
import androidx.fragment.app.Fragment
import androidx.lifecycle.Observer
import androidx.lifecycle.ViewModelProviders
import com.android.volley.Request
import com.android.volley.Response
import com.android.volley.toolbox.JsonArrayRequest
import com.android.volley.toolbox.Volley
import com.example.hiking_2.R
import com.google.android.material.card.MaterialCardView
import kotlinx.android.synthetic.main.fragment_home.*
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
        println("hello world")

        // Instantiate the RequestQueue.
        val queue = Volley.newRequestQueue(this.context)
        val url = "http://10.0.2.2:8000/json"
//        val url =  "https://aptproject-255903.appspot.com/locations"

        val jsonGetRequest = JsonArrayRequest(Request.Method.GET, url, null,
            Response.Listener<JSONArray> { response ->
                println("Response: %s".format(response.toString()))
                var idx = 0;
                while (idx < response.length()) {

                    val themeJson = response.getJSONObject(idx)

//                    println(themeJson.getString("feature_name"))
//                    print(themeJson.getJSONObject("feature_id").getString("\$oid"))
//
//                    println()
                    ++idx

                    var newCardTextView = TextView(this.context)
                    newCardTextView.text = themeJson.getString("feature_name")

                    var newImg = ImageView(this.context)
//                    newImg.

                    var newCard = MaterialCardView(this.context)
                    newCard.addView(newCardTextView)


                    newCard.addView(newImg)

                    var param: RelativeLayout.LayoutParams = RelativeLayout.LayoutParams(RelativeLayout.LayoutParams.MATCH_PARENT,
                                                             RelativeLayout.LayoutParams.WRAP_CONTENT)
                    param.topMargin = 25
                    newCard.layoutParams = param
                    newCard.minimumHeight = 200

                    theme_linear_layout.addView(newCard)
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