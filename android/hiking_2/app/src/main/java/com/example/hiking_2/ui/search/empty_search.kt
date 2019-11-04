package com.example.hiking_2.ui.search

import android.content.Intent
import android.os.Bundle
import android.widget.SearchView
import androidx.appcompat.app.AppCompatActivity
import com.example.hiking_2.R
import com.example.hiking_2.ui.search.Search.Companion.tagToPass
import kotlinx.android.synthetic.main.empty_search.*
import kotlinx.android.synthetic.main.search.*

class empty_search : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.empty_search)
        println("connected to empty search !!!!!!!!")

        val searchPage = Intent(this, Search::class.java)



        emptySearchView.setOnQueryTextListener(object : SearchView.OnQueryTextListener {

            override fun onQueryTextChange(s: String): Boolean {
                println("I'm changing !!!!!!!")
                return true
            }

            override fun onQueryTextSubmit(s: String): Boolean {
                println("I submitted !!!!!!!!")
                val whatItype = emptySearchView.query.toString()
                println(whatItype)

                val SearchPage = Intent(this@empty_search, Search::class.java)
                SearchPage.putExtra(tagToPass, whatItype)

                startActivity(SearchPage)

                return true
            }
        })

    }
}