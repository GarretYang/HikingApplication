package com.example.hiking_2.ui.add

import android.R
import android.os.Bundle
import android.view.ViewGroup
import android.view.LayoutInflater
import android.view.View
import androidx.fragment.app.Fragment
import androidx.lifecycle.ViewModelProviders


class CreateReportFragment : Fragment() {

    private lateinit var createReportViewModel: CreateReportViewModel

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {

        createReportViewModel = ViewModelProviders.of(this).get(CreateReportViewModel::class.java)
        val root = inflater.inflate(com.example.hiking_2.R.layout.fragment_create_feature, container, false)

        return root
    }
}