package com.example.hiking_2.ui.account

import android.app.Activity
import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.view.View
import android.widget.Button
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.example.hiking_2.MainActivity
import com.example.hiking_2.R
import com.firebase.ui.auth.AuthUI
import com.firebase.ui.auth.IdpResponse
import com.google.android.material.button.MaterialButton
import com.google.firebase.auth.FirebaseAuth
import kotlinx.android.synthetic.main.activity_login.*
import kotlinx.android.synthetic.main.fragment_account.*
import kotlinx.android.synthetic.main.fragment_create_report.*
import kotlinx.android.synthetic.main.fragment_create_theme.*
import java.lang.Math.log

import java.util.*

class LoginActivity : AppCompatActivity() {

    lateinit var providers: List<AuthUI.IdpConfig>
    private val MY_REQUEST_CODE: Int = 7117

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_login)
        providers = Arrays.asList<AuthUI.IdpConfig>(
            AuthUI.IdpConfig.GoogleBuilder().build())

        showSignInOption()
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        if(requestCode == MY_REQUEST_CODE) {
            val response = IdpResponse.fromResultIntent(data)
            if(resultCode == Activity.RESULT_OK) {
                val user = FirebaseAuth.getInstance().currentUser
                Toast.makeText(this, ""+user!!.email, Toast.LENGTH_SHORT).show()
                btnSignOut.setEnabled(true)
                btnSignOut.setOnClickListener {
                AuthUI.getInstance().signOut(this@LoginActivity)
                .addOnCompleteListener {
                    btnSignOut.setEnabled(false)
                    showSignInOption()
                    var toMain = Intent(this, MainActivity::class.java)
                    Log.i("SIGNOUT", "Successfully sign out!")

                    startActivity(toMain)
                }
                .addOnFailureListener {
                        e-> Toast.makeText(this@LoginActivity, e.message, Toast.LENGTH_SHORT).show()
                        Log.e("SINGOUT", "Singout fails!")
                }
        }

            } else {
                Toast.makeText(this, ""+response!!.error!!.message, Toast.LENGTH_SHORT).show()
            }
        }
    }

    private fun showSignInOption() {
        startActivityForResult(AuthUI.getInstance().createSignInIntentBuilder()
            .setAvailableProviders(providers)
            .build(), MY_REQUEST_CODE
        )
    }
}