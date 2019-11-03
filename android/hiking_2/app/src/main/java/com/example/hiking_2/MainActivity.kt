package com.example.hiking_2

import android.content.Intent
import android.os.Bundle
import android.view.View
import com.google.android.material.bottomnavigation.BottomNavigationView
import androidx.appcompat.app.AppCompatActivity
import androidx.navigation.findNavController
import androidx.navigation.ui.AppBarConfiguration
import androidx.navigation.ui.setupActionBarWithNavController
import androidx.navigation.ui.setupWithNavController
import com.example.hiking_2.ui.MapsActivity
import com.example.hiking_2.ui.home.SingleTheme

class MainActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        val navView: BottomNavigationView = findViewById(R.id.nav_view)
        val navController = findNavController(R.id.nav_host_fragment)
        // Passing each menu ID as a set of Ids because each
        // menu should be considered as top level destinations.
        val appBarConfiguration = AppBarConfiguration(
            setOf(
                R.id.navigation_home, R.id.navigation_search, R.id.navigation_add, R.id.navigation_account
            )
        )
        setupActionBarWithNavController(navController, appBarConfiguration)
        navView.setupWithNavController(navController)
    }

    // Transition function to Google map
    fun transitionToMap(view: View) {

        val mapIntent = Intent(this, MapsActivity::class.java)

        // Start new activity
        startActivity(mapIntent)
    }

    // go to single theme page
    fun goSingleTheme(view: View) {

        val singlePage = Intent(this, SingleTheme::class.java)

        // Start new activity
        startActivity(singlePage)
    }

}
