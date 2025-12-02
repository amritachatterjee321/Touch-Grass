// Firebase Storage utilities for image uploads
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { storage } from './config'

/**
 * Upload an image file to Firebase Storage
 * @param file - The image file to upload
 * @param path - Storage path (e.g., 'profile-images/userId.jpg')
 * @returns Promise<string> - The download URL of the uploaded image
 */
export const uploadImageToStorage = async (
  file: File | Blob,
  path: string
): Promise<string> => {
  try {
    const storageRef = ref(storage, path)
    await uploadBytes(storageRef, file)
    const downloadURL = await getDownloadURL(storageRef)
    return downloadURL
  } catch (error: any) {
    console.error('❌ Error uploading image to storage:', error)
    throw new Error(`Failed to upload image: ${error.message}`)
  }
}

/**
 * Upload a base64 image string to Firebase Storage
 * @param base64String - Base64 encoded image string (data URL)
 * @param path - Storage path (e.g., 'profile-images/userId.jpg')
 * @returns Promise<string> - The download URL of the uploaded image
 */
export const uploadBase64ImageToStorage = async (
  base64String: string,
  path: string
): Promise<string> => {
  try {
    // Convert base64 to blob
    const response = await fetch(base64String)
    const blob = await response.blob()
    
    // Upload blob to storage
    return await uploadImageToStorage(blob, path)
  } catch (error: any) {
    console.error('❌ Error uploading base64 image to storage:', error)
    throw new Error(`Failed to upload base64 image: ${error.message}`)
  }
}

/**
 * Delete an image from Firebase Storage
 * @param path - Storage path of the image to delete
 */
export const deleteImageFromStorage = async (path: string): Promise<void> => {
  try {
    const storageRef = ref(storage, path)
    await deleteObject(storageRef)
  } catch (error: any) {
    console.error('❌ Error deleting image from storage:', error)
    // Don't throw - it's okay if the image doesn't exist
  }
}

