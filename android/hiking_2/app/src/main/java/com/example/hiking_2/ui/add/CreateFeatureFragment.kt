package com.example.hiking_2.ui.add

import android.os.Bundle
import android.util.Log
import android.view.ViewGroup
import android.view.LayoutInflater
import android.view.View
import android.widget.Button
import android.widget.EditText
import android.widget.TextView
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.lifecycle.ViewModelProviders
import com.android.volley.Request
import com.android.volley.Response
import com.android.volley.toolbox.JsonObjectRequest
import com.android.volley.toolbox.Volley
import com.example.hiking_2.R
import com.google.android.material.button.MaterialButton
import com.google.firebase.auth.FirebaseAuth
import kotlinx.android.synthetic.main.fragment_create_theme.*
import org.json.JSONObject
import java.lang.reflect.Array


class CreateFeatureFragment : Fragment() {

    private lateinit var createFeatureViewModel: CreateFeatureViewModel

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {

        createFeatureViewModel = ViewModelProviders.of(this).get(CreateFeatureViewModel::class.java)
        val root = inflater.inflate(com.example.hiking_2.R.layout.fragment_create_theme, container, false)
// button onclick listener
        val newThemeCreate = root.findViewById<Button>(R.id.submit_new_theme)
        newThemeCreate.setOnClickListener {
            val newThemeName = root.findViewById<EditText>(R.id.new_theme_name)
            val newLocation = root.findViewById<EditText>(R.id.new_theme_location)
            if (!newThemeName.text.isEmpty() && !newLocation.text.isEmpty()) {
                val correctT = Toast.makeText(root.getContext(), "Creating New Theme", Toast.LENGTH_LONG)
                correctT.show()

                val queue = Volley.newRequestQueue(root.context)
                val url = "http://http://aptproject-255903.appspot.com/newcreatereportjson"
                var params = JSONObject()
                params.put("feature_name", newThemeName.text)
                params.put("feature_location", newLocation.text)
//                params.put("feature_reports", ArrayList<>)
                val notifi = root.findViewById<TextView>(R.id.notification)

                var jsonObjectRequest = JsonObjectRequest(
                    Request.Method.POST, url, params,
                    Response.Listener { response ->
                        notifi.text = "Response: %s".format(response.toString())
                    },
                    Response.ErrorListener { error ->
                        Log.e("POST-REQUEST", error.toString())
                    }
                )

                Log.i("REQUEST", jsonObjectRequest.toString())
                for(thing in jsonObjectRequest.body) {
                    Log.i("THING", thing.toString())
                }
                Log.i("BODY", jsonObjectRequest.body.toString())
                Log.i("TYPE", jsonObjectRequest.bodyContentType)
                Log.i("asdf", jsonObjectRequest.headers.toString())

                queue.add(jsonObjectRequest)

            } else {
                val newToast = Toast.makeText(root.context, "Error!", Toast.LENGTH_SHORT)
                newToast.show()
            }
        }
        var themeBtn: MaterialButton = root.findViewById(R.id.submit_new_theme)

        if(FirebaseAuth.getInstance().currentUser != null){
            // User is signed in
            themeBtn.setEnabled(true)
            themeBtn.setText("Submit")

        }else{
            // User is signed out
            themeBtn.setEnabled(false)
            themeBtn.setText("Please Login First")
        }
        return root
    }
}