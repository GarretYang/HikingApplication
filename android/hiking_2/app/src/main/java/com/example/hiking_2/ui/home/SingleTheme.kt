package com.example.hiking_2.ui.home

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import com.example.hiking_2.R

import kotlinx.android.synthetic.main.single_page.*

class SingleTheme : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.single_page)

        getSingleTheme()

    }

    private fun getSingleTheme() {
        themeName.text = "nope"
        println("connected!!!!!!!!")
    }
}