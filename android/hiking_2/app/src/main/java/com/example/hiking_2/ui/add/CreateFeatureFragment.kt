package com.example.hiking_2.ui.add

import android.R
import android.os.Bundle
import android.view.ViewGroup
import android.view.LayoutInflater
import android.view.View
import androidx.fragment.app.Fragment
import androidx.lifecycle.ViewModelProviders


class CreateFeatureFragment : Fragment() {

    private lateinit var createFeatureViewModel: CreateFeatureViewModel

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {

        createFeatureViewModel = ViewModelProviders.of(this).get(CreateFeatureViewModel::class.java)
        val root = inflater.inflate(com.example.hiking_2.R.layout.fragment_create_report, container, false)

        return root
    }
}