package com.example.hiking_2.ui.add

import android.content.Context
import android.content.Intent
import android.graphics.Color
import android.os.Build
import android.os.Bundle
import android.view.Gravity
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.*
import androidx.core.content.ContextCompat.getSystemService
import androidx.fragment.app.Fragment
import androidx.lifecycle.Observer
import androidx.lifecycle.ViewModelProviders
import androidx.transition.Slide
import androidx.transition.TransitionManager
import com.example.hiking_2.R
import kotlinx.android.synthetic.main.activity_main.*
import kotlinx.android.synthetic.main.fragment_add.*


@Suppress("UNREACHABLE_CODE")
class AddFragment : Fragment() {

    private lateinit var addViewModel: AddViewModel

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        addViewModel = ViewModelProviders.of(this).get(AddViewModel::class.java)
        val root = inflater.inflate(com.example.hiking_2.R.layout.fragment_add, container, false)
        val textView: TextView = root.findViewById(com.example.hiking_2.R.id.text_add)
        val buttonNewTheme = root.findViewById(R.id.addTheme) as Button
        val buttonNewReport = root.findViewById(R.id.addReport) as Button
        addViewModel.text.observe(this, Observer {
            textView.text = it
        })

        buttonNewTheme.setOnClickListener {
            // variable for addTheme activity
            val addThemeActivity = Intent(context, AddTheme::class.java)

            // Start the new activity.
            startActivity(addThemeActivity)
        }

        buttonNewReport.setOnClickListener {
//            val myToast = Toast.makeText(context, "Create a new Report!", Toast.LENGTH_SHORT)
//            myToast.show()
            // variable for addTheme activity
            val addReportActivity = Intent(context, AddReport::class.java)

            // Start the new activity.
            startActivity(addReportActivity)
        }

        return root
    }
}