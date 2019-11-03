package com.example.hiking_2.ui.add

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel

class CreateFeatureViewModel : ViewModel() {

    private val _text = MutableLiveData<String>().apply {
        value = "This is add Feature"
    }
    val text: LiveData<String> = _text
}