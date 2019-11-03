package com.example.hiking_2.ui.add

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel

class CreateReportViewModel : ViewModel() {

    private val _text = MutableLiveData<String>().apply {
        value = "This is add Report"
    }
    val text: LiveData<String> = _text
}