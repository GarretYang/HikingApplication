package com.example.hiking_2.ui.account

import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.TextView
import android.widget.Toast
import androidx.annotation.NonNull
import androidx.fragment.app.Fragment
import androidx.lifecycle.Observer
import androidx.lifecycle.ViewModelProviders
import com.example.hiking_2.R
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.FirebaseUser

class AccountFragment : Fragment() {

    private lateinit var accountViewModel: AccountViewModel

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        accountViewModel =
            ViewModelProviders.of(this).get(AccountViewModel::class.java)
        val root = inflater.inflate(R.layout.fragment_account, container, false)
        val textView: TextView = root.findViewById(R.id.text_account)
        val loginButton: Button = root.findViewById(R.id.btnLogin)

        accountViewModel.text.observe(this, Observer {
            textView.text = it
        })

        loginButton.setOnClickListener {
            val loginActivity = Intent(context, LoginActivity::class.java)

            startActivity(loginActivity)
        }


        FirebaseAuth.AuthStateListener { auth ->
            val user = auth.currentUser
            if(user != null){
                // User is signed in
                println("user is here")
            }else{
                // User is signed out
                println("user isnot here")
            }
        }

        return root

    }


}