package com.example.hiking_2.ui.add

import androidx.fragment.app.Fragment
import androidx.fragment.app.FragmentManager
import androidx.fragment.app.FragmentStatePagerAdapter


class CreateTabsAdapter(fm: FragmentManager, internal var mNumOfTabs: Int) :
    FragmentStatePagerAdapter(fm, BEHAVIOR_RESUME_ONLY_CURRENT_FRAGMENT) {
    override fun getCount(): Int {
        return mNumOfTabs
    }

    override fun getItem(position: Int): Fragment {
        when (position) {
            0 -> {
                return CreateReportFragment()
            }
            1 -> {
                return CreateFeatureFragment()
            }
            else -> return CreateReportFragment()
        }
    }
}