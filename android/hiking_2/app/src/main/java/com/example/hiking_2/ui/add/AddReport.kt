package com.example.hiking_2.ui.add

import android.annotation.SuppressLint
import android.content.Intent
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.media.MediaScannerConnection
import android.net.Uri
import android.os.Bundle
import android.os.Environment
import android.provider.MediaStore
import android.util.Log
import android.view.View
import com.google.android.material.snackbar.Snackbar
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.FileProvider
import com.example.hiking_2.R
import kotlinx.android.synthetic.main.activity_add_report.*
import kotlinx.android.synthetic.main.activity_report_details.*
import java.io.File
import java.io.IOException
import java.text.SimpleDateFormat
import java.util.*
import android.widget.ImageView
import android.widget.Toast
import kotlinx.android.synthetic.main.content_add_report.*
import java.io.ByteArrayOutputStream
import java.io.FileOutputStream


class AddReport : AppCompatActivity() {

    val REQUEST_IMAGE_CAPTURE = 1
//    var imageView = findViewById(R.id.iv)
    private val GALLERY = 2
    private val CAMERA = 1


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(com.example.hiking_2.R.layout.activity_add_report)

        setSupportActionBar(toolbar)
//        fab.setOnClickListener { view ->
//            Snackbar.make(view, "Replace with your own action", Snackbar.LENGTH_LONG)
//                .setAction("Action", null).show()
//        }

//        takePhotoDialog = DialogGetPhotoFrom.getInstance().apply {
//            setListener(object : DialogGetPhotoFrom.DialogListener {
//                override fun onTakeFromGallery() {
//                    dispatchSelectFromGalleryIntent()
//                }
//
//                override fun onTakePhoto() {
//                    dispatchTakePictureIntent()
//                }
//            })
//        }
//
//        projectDetails_pickImage.setOnClickListener {
//            takePhotoDialog?.show(supportFragmentManager)
//        }
    }

//    private fun dispatchSelectFromGalleryIntent() {
//        val intent = Intent().apply {
//            type = "image/*"
//            action = Intent.ACTION_GET_CONTENT
//        }
//        startActivityForResult(Intent.createChooser(intent, "Select Image"), REQUEST_PICK_IMAGE)
//    }

    fun dispatchTakePictureIntent(view: View) {
        Intent(MediaStore.ACTION_IMAGE_CAPTURE).also { takePictureIntent ->
        takePictureIntent.resolveActivity(packageManager)?.also {
            startActivityForResult(takePictureIntent, REQUEST_IMAGE_CAPTURE)
        }
        }
        val myToast = Toast.makeText(this, "dispatchTP!", Toast.LENGTH_SHORT)
        myToast.show()
    }


//    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
//        if (requestCode == REQUEST_IMAGE_CAPTURE && resultCode == RESULT_OK) {
//            val imageBitmap = data?.extras?.get("data") as Bitmap
//            imageView.setImageBitmap(imageBitmap)
//        }
//        val myToast = Toast.makeText(this, "onAR!", Toast.LENGTH_SHORT)
//        myToast.show()
//    }


    var currentPhotoPath: String = "Android/data/com.example.hiking_2/files/Pictures"
    @Throws(IOException::class)
    private fun createImageFile(): File {
        // Create an image file name
        val timeStamp: String = SimpleDateFormat("yyyyMMdd_HHmmss").format(Date())
        val storageDir: File = getExternalFilesDir(Environment.DIRECTORY_PICTURES)
        return File.createTempFile(
            "JPEG_${timeStamp}_", /* prefix */
            ".jpg", /* suffix */
            storageDir /* directory */
        ).apply {
            // Save a file: path for use with ACTION_VIEW intents
            currentPhotoPath = absolutePath
        }
    }

    val REQUEST_TAKE_PHOTO = 1

    private fun dispatchTakePictureIntent() {
        Intent(MediaStore.ACTION_IMAGE_CAPTURE).also { takePictureIntent ->
            // Ensure that there's a camera activity to handle the intent
            takePictureIntent.resolveActivity(packageManager)?.also {
                // Create the File where the photo should go
                val photoFile: File? = try {
                    createImageFile()
                } catch (ex: IOException) {
                    // Error occurred while creating the File
//                    ...
//                    null
                    val myToast = Toast.makeText(this, "ErrorInDispatchTake!", Toast.LENGTH_SHORT)
                    myToast.show()
                    null
                }
                // Continue only if the File was successfully created
                photoFile?.also {
                    val photoURI: Uri = FileProvider.getUriForFile(
                        this,
                        "com.example.hiking_2.android.provider",
                        it
                    )
                    takePictureIntent.putExtra(MediaStore.EXTRA_OUTPUT, photoURI)
                    startActivityForResult(takePictureIntent, REQUEST_TAKE_PHOTO)
                }
            }
        }
        val myToast = Toast.makeText(this, "dispatchTake!", Toast.LENGTH_SHORT)
        myToast.show()
    }
//
//    private fun processCapturedPhoto() {
//        val cursor = contentResolver.query(Uri.parse(mCurrentPhotoPath),
//            Array(1) {android.provider.MediaStore.Images.ImageColumns.DATA},
//            null, null, null)
//        cursor.moveToFirst()
//        val photoPath = cursor.getString(0)
//        cursor.close()
//        val file = File(photoPath)
//        val uri = Uri.fromFile(file)
//
//        val height = resources.getDimensionPixelSize(R.dimen.photo_height)
//        val width = resources.getDimensionPixelSize(R.dimen.photo_width)
//
//        val request = ImageRequestBuilder.newBuilderWithSource(uri)
//            .setResizeOptions(ResizeOptions(width, height))
//            .build()
//        val controller = Fresco.newDraweeControllerBuilder()
//            .setOldController(imgvPhoto?.controller)
//            .setImageRequest(request)
//            .build()
//        imgvPhoto?.controller = controller
//    }


    private fun galleryAddPic() {
        Intent(Intent.ACTION_MEDIA_SCANNER_SCAN_FILE).also { mediaScanIntent ->
            val f = File(currentPhotoPath)
            mediaScanIntent.data = Uri.fromFile(f)
            sendBroadcast(mediaScanIntent)
        }
        val myToast = Toast.makeText(this, "galleryAP!", Toast.LENGTH_SHORT)
        myToast.show()
    }

    private fun setPic() {
        // Get the dimensions of the View
        val targetW: Int = imageView.width
        val targetH: Int = imageView.height

        val bmOptions = BitmapFactory.Options().apply {
            // Get the dimensions of the bitmap
            inJustDecodeBounds = true

            val photoW: Int = outWidth
            val photoH: Int = outHeight

            // Determine how much to scale down the image
            val scaleFactor: Int = Math.min(photoW / targetW, photoH / targetH)

            // Decode the image file into a Bitmap sized to fill the View
            inJustDecodeBounds = false
            inSampleSize = scaleFactor
            inPurgeable = true
        }
        BitmapFactory.decodeFile(currentPhotoPath, bmOptions)?.also { bitmap ->
            imageView.setImageBitmap(bitmap)
        }
        val myToast = Toast.makeText(this, "setPic!", Toast.LENGTH_SHORT)
        myToast.show()
    }



    fun choosePhotoFromGallery(view: View) {
        val galleryIntent = Intent(Intent.ACTION_PICK,
            MediaStore.Images.Media.EXTERNAL_CONTENT_URI)

        startActivityForResult(galleryIntent, GALLERY)
    }

    private fun dispatchSelectFromGalleryIntent() {
        val intent = Intent().apply {
            type = "image/*"
            action = Intent.ACTION_GET_CONTENT
        }
        startActivityForResult(intent, CAMERA)
    }

//    private fun dispatchTakePictureIntent(view: View) {
//        val intent = Intent(MediaStore.ACTION_IMAGE_CAPTURE)
//        startActivityForResult(intent, CAMERA)
//    }

    public override fun onActivityResult(requestCode:Int, resultCode:Int, data: Intent?) {

        super.onActivityResult(requestCode, resultCode, data)
        /* if (resultCode == this.RESULT_CANCELED)
         {
         return
         }*/
        if (requestCode == GALLERY)
        {
            if (data != null)
            {
                val contentURI = data.data
                System.out.println("FIND ME")
                System.out.println(contentURI)
                try
                {
                    val bitmap = MediaStore.Images.Media.getBitmap(this.contentResolver, contentURI)
                    val path = saveImage(bitmap)
                    Toast.makeText(this@AddReport, "Image Saved!", Toast.LENGTH_SHORT).show()
                    imageView!!.setImageBitmap(bitmap)

                }
                catch (e: IOException) {
                    e.printStackTrace()
                    Toast.makeText(this@AddReport, "Failed!", Toast.LENGTH_SHORT).show()
                }

            }

        }
        else
        {
            if (data != null) {
                val thumbnail = data!!.extras!!.get("data") as Bitmap
                iv.setImageBitmap(thumbnail)
                saveImage(thumbnail)
                Toast.makeText(this@AddReport, "Image Saved!", Toast.LENGTH_SHORT).show()
            }
        }
    }

    fun saveImage(myBitmap: Bitmap):String {
        val bytes = ByteArrayOutputStream()
        myBitmap.compress(Bitmap.CompressFormat.JPEG, 90, bytes)
        val wallpaperDirectory = File(
            (Environment.getExternalStorageDirectory()).toString() + IMAGE_DIRECTORY)
        // have the object build the directory structure, if needed.
        Log.d("fee",wallpaperDirectory.toString())
        if (!wallpaperDirectory.exists())
        {

            wallpaperDirectory.mkdirs()
        }

        try
        {
            Log.d("heel",wallpaperDirectory.toString())
            val f = File(wallpaperDirectory, ((Calendar.getInstance()
                .getTimeInMillis()).toString() + ".jpg"))
            f.createNewFile()
            val fo = FileOutputStream(f)
            fo.write(bytes.toByteArray())
            MediaScannerConnection.scanFile(this,
                arrayOf(f.getPath()),
                arrayOf("image/jpeg"), null)
            fo.close()
            Log.d("TAG", "File Saved::--->" + f.getAbsolutePath())

            return f.getAbsolutePath()
        }
        catch (e1: IOException) {
            e1.printStackTrace()
        }

        return ""
    }

    companion object {
        private val IMAGE_DIRECTORY = "/demonuts"
    }

}
