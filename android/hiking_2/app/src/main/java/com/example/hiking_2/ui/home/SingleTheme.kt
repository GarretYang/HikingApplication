package com.example.hiking_2.ui.home

import android.graphics.Color
import android.os.Bundle
import android.view.ViewGroup
import android.widget.RelativeLayout
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import androidx.cardview.widget.CardView
import com.android.volley.toolbox.StringRequest
import com.android.volley.toolbox.Volley
import com.android.volley.Request
import com.android.volley.Response
import com.android.volley.toolbox.JsonArrayRequest
import com.android.volley.toolbox.JsonObjectRequest
import com.example.hiking_2.R
import com.google.android.material.card.MaterialCardView
import kotlinx.android.synthetic.main.content_add_theme.*
import org.json.JSONArray

import kotlinx.android.synthetic.main.single_page.*
import org.json.JSONObject

class SingleTheme : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.single_page)

        getSingleTheme()

    }

    private fun getSingleTheme() {
        themeName.text = "nope"
        println("connected!!!!!!!!")

        // Instantiate the RequestQueue.
        val queue = Volley.newRequestQueue(this)
        val url = "https://aptproject-255903.appspot.com/json/reports?theme=Kayaking"

        // Request a string response from the provided URL.
        val jsonGetRequest = JsonObjectRequest(Request.Method.GET, url, null,
            Response.Listener<JSONObject> { response ->


                val selected_feature = response.getString("selected_feature")
                val reports = response.getJSONArray("reports")
                val user_name = response.getJSONArray("user_name")

                themeName.text = "Response: %s".format(response.toString())
                themeName.text = "$reports"
                themeName.text = "$selected_feature"

                report_1.text = "${reports[0]}"

                var i = 0
                while (i < reports.length()) {
                    report_1.text = "${reports[i]}"

                    var newCard = MaterialCardView(this)

                    var nameTextView = TextView(this)
                    nameTextView.text = "${user_name[i]}"

                    var dateTextview = TextView(this)
                    var current_report = reports.getJSONObject(i)
                    dateTextview.text = current_report.getString("date_in")


                    //tagTextView.text = current_report.getJSONArray("tags")[0].toString()
                    var current_tags = current_report.getJSONArray("tags")
                    var idx = 0
                    while (idx < current_tags.length()) {
                        var tagTextView = TextView(this)
                        tagTextView.text = "${current_tags[idx]}"
                        newCard.addView(tagTextView)
                        ++idx
                    }


                    //newCard.addView(nameTextView)
                    //newCard.addView(dateTextview)
                    //newCard.addView(tagTextView)

                    var param: RelativeLayout.LayoutParams = RelativeLayout.LayoutParams(RelativeLayout.LayoutParams.MATCH_PARENT,
                        RelativeLayout.LayoutParams.WRAP_CONTENT)
                    param.topMargin = 25
                    newCard.layoutParams = param
                    newCard.minimumHeight = 200

                    linear_layout.addView(newCard)

                    ++i
                }

            },
            Response.ErrorListener { textView.text = "That didn't work!" })

        // Add the request to the RequestQueue.
        queue.add(jsonGetRequest)
    }
}