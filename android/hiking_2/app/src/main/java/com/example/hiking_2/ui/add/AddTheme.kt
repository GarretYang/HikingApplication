package com.example.hiking_2.ui.add

import android.os.Bundle
import android.util.Log
import android.widget.TextView
import android.widget.Toast
import com.google.android.material.snackbar.Snackbar
import androidx.appcompat.app.AppCompatActivity
import com.android.volley.toolbox.JsonObjectRequest
import com.android.volley.toolbox.Volley
import com.example.hiking_2.R

import kotlinx.android.synthetic.main.activity_add_theme.*
import org.json.JSONObject

class AddTheme : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_add_theme)
        setSupportActionBar(toolbar)
        takeNewTheme()

//        fab.setOnClickListener { view ->
//            Snackbar.make(view, "Replace with your own action", Snackbar.LENGTH_LONG)
//                .setAction("Action", null).show()
//        }
    }

    fun takeNewTheme(){
//        val queue = Volley.newRequestQueue(this)
//        val url = "http://10.0.22:5000/newcreatereportjson"
//
//        val feature = "Board Walk Trail"
//        val location_name = "Lady Bird Lake"
//        val location_long = "..."
//        val location_?? = "..."
//
//        var params = JSONObject()
//        params.put("feature", feature)
//        params.put("location", location_name)
//
//        val textView = findViewById<TextView>(R.id.textView)
//
//        var jsonObjectRequest = JsonObjectRequest(
//            Request.Method.POST, url, params,
//            Response.Listener { response ->
//                textView.text = "Response: %s".format(response.toString())
//            },
//            Response.ErrorListener { error ->
//                Log.e("POST-REQUEST", error.toString())
//            }
//        )
//
//        Log.i("REQUEST", jsonObjectRequest.toString())
//        for(thing in jsonObjectRequest.body) {
//            Log.i("THING", thing.toString())
//        }
//        Log.i("BODY", jsonObjectRequest.body.toString())
//        Log.i("TYPE", jsonObjectRequest.bodyContentType)
//        Log.i("asdf", jsonObjectRequest.headers.toString())
//
//        queue.add(jsonObjectRequest)

    }

}
