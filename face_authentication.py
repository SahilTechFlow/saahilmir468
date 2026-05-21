import cv2
import face_recognition
import numpy as np
import os
import pickle
from pathlib import Path
from datetime import datetime

class FaceAuthenticator:
    """
    A face recognition authentication system using OpenCV and face_recognition library.
    """
    
    def __init__(self, known_faces_dir="known_faces", encodings_file="face_encodings.pkl"):
        """
        Initialize the Face Authenticator.
        
        Args:
            known_faces_dir: Directory containing known face images organized by person name
            encodings_file: File to store pre-computed face encodings
        """
        self.known_faces_dir = known_faces_dir
        self.encodings_file = encodings_file
        self.known_face_encodings = []
        self.known_face_names = []
        self.tolerance = 0.6  # Face matching tolerance (lower = stricter)
        
        # Create directories if they don't exist
        Path(known_faces_dir).mkdir(parents=True, exist_ok=True)
        
        # Load or create face encodings
        self.load_or_create_encodings()
    
    def encode_faces_from_directory(self):
        """
        Encode all faces in the known_faces directory.
        Directory structure should be: known_faces/person_name/image.jpg
        """
        print("🔍 Encoding faces from directory...")
        self.known_face_encodings = []
        self.known_face_names = []
        
        for person_name in os.listdir(self.known_faces_dir):
            person_dir = os.path.join(self.known_faces_dir, person_name)
            
            if not os.path.isdir(person_dir):
                continue
            
            print(f"  Processing {person_name}...")
            
            for image_name in os.listdir(person_dir):
                image_path = os.path.join(person_dir, image_name)
                
                try:
                    # Load image
                    image = face_recognition.load_image_file(image_path)
                    
                    # Get face encodings
                    face_encodings = face_recognition.face_encodings(image)
                    
                    if face_encodings:
                        # Store the first face encoding found
                        self.known_face_encodings.append(face_encodings[0])
                        self.known_face_names.append(person_name)
                        print(f"    ✓ Encoded {image_name}")
                    else:
                        print(f"    ✗ No face found in {image_name}")
                
                except Exception as e:
                    print(f"    ✗ Error processing {image_name}: {e}")
        
        # Save encodings to file
        self.save_encodings()
        print(f"✅ Encoding complete! {len(self.known_face_encodings)} faces encoded.\n")
    
    def save_encodings(self):
        """Save face encodings to a pickle file."""
        data = {
            'encodings': self.known_face_encodings,
            'names': self.known_face_names
        }
        with open(self.encodings_file, 'wb') as f:
            pickle.dump(data, f)
        print(f"💾 Encodings saved to {self.encodings_file}")
    
    def load_or_create_encodings(self):
        """Load encodings from file or create new ones."""
        if os.path.exists(self.encodings_file):
            try:
                with open(self.encodings_file, 'rb') as f:
                    data = pickle.load(f)
                    self.known_face_encodings = data['encodings']
                    self.known_face_names = data['names']
                print(f"✅ Loaded {len(self.known_face_encodings)} face encodings from file.")
            except Exception as e:
                print(f"⚠️  Error loading encodings: {e}")
                print("Creating new encodings...")
                self.encode_faces_from_directory()
        else:
            print("📁 No encodings file found. Creating new encodings...")
            self.encode_faces_from_directory()
    
    def add_person_face(self, person_name, image_path):
        """
        Add a new person's face to the authentication system.
        
        Args:
            person_name: Name of the person
            image_path: Path to the face image
        
        Returns:
            bool: True if successful, False otherwise
        """
        try:
            # Create person directory
            person_dir = os.path.join(self.known_faces_dir, person_name)
            Path(person_dir).mkdir(parents=True, exist_ok=True)
            
            # Load and encode the image
            image = face_recognition.load_image_file(image_path)
            face_encodings = face_recognition.face_encodings(image)
            
            if not face_encodings:
                print("❌ No face detected in the image!")
                return False
            
            # Save the image to person directory
            filename = f"{person_name}_{len(os.listdir(person_dir)) + 1}.jpg"
            dest_path = os.path.join(person_dir, filename)
            
            # Copy the image
            import shutil
            shutil.copy(image_path, dest_path)
            
            # Add to encodings
            self.known_face_encodings.append(face_encodings[0])
            self.known_face_names.append(person_name)
            
            # Save updated encodings
            self.save_encodings()
            
            print(f"✅ Successfully added {person_name}'s face!")
            return True
        
        except Exception as e:
            print(f"❌ Error adding face: {e}")
            return False
    
    def authenticate_face(self, image_path):
        """
        Authenticate a face from an image file.
        
        Args:
            image_path: Path to the image to authenticate
        
        Returns:
            dict: Contains 'authenticated' (bool), 'name' (str), and 'distance' (float)
        """
        try:
            # Load image
            image = face_recognition.load_image_file(image_path)
            face_encodings = face_recognition.face_encodings(image)
            
            if not face_encodings:
                return {
                    'authenticated': False,
                    'name': 'Unknown',
                    'distance': 1.0,
                    'message': 'No face detected in image'
                }
            
            # Compare face with known faces
            face_encoding = face_encodings[0]
            face_distances = face_recognition.face_distance(
                self.known_face_encodings, 
                face_encoding
            )
            
            if len(face_distances) == 0:
                return {
                    'authenticated': False,
                    'name': 'Unknown',
                    'distance': 1.0,
                    'message': 'No known faces in database'
                }
            
            best_match_index = np.argmin(face_distances)
            best_match_distance = face_distances[best_match_index]
            
            # Check if match is within tolerance
            if best_match_distance < self.tolerance:
                name = self.known_face_names[best_match_index]
                return {
                    'authenticated': True,
                    'name': name,
                    'distance': float(best_match_distance),
                    'message': f'✅ Authentication successful! Welcome, {name}!'
                }
            else:
                return {
                    'authenticated': False,
                    'name': 'Unknown',
                    'distance': float(best_match_distance),
                    'message': '❌ Face not recognized. Authentication failed.'
                }
        
        except Exception as e:
            return {
                'authenticated': False,
                'name': 'Error',
                'distance': 1.0,
                'message': f'❌ Error during authentication: {e}'
            }
    
    def authenticate_from_camera(self, timeout=30):
        """
        Real-time face authentication using webcam.
        
        Args:
            timeout: Time limit in seconds for authentication attempt
        
        Returns:
            dict: Authentication result
        """
        if len(self.known_face_encodings) == 0:
            print("❌ No known faces in database. Please add faces first.")
            return {'authenticated': False, 'name': 'Unknown'}
        
        print("📷 Starting webcam for face authentication...")
        print("Press 'SPACE' to capture, 'q' to quit")
        
        video_capture = cv2.VideoCapture(0)
        
        # Check if camera opened successfully
        if not video_capture.isOpened():
            print("❌ Could not open webcam")
            return {'authenticated': False, 'name': 'Error'}
        
        start_time = datetime.now()
        
        while True:
            ret, frame = video_capture.read()
            
            if not ret:
                print("❌ Failed to read from camera")
                break
            
            # Resize frame for faster processing
            small_frame = cv2.resize(frame, (0, 0), fx=0.25, fy=0.25)
            rgb_small_frame = cv2.cvtColor(small_frame, cv2.COLOR_BGR2RGB)
            
            # Detect faces
            face_locations = face_recognition.face_locations(rgb_small_frame)
            face_encodings = face_recognition.face_encodings(rgb_small_frame, face_locations)
            
            face_names = []
            face_distances_list = []
            
            for face_encoding in face_encodings:
                face_distances = face_recognition.face_distance(
                    self.known_face_encodings,
                    face_encoding
                )
                best_match_index = np.argmin(face_distances)
                best_match_distance = face_distances[best_match_index]
                
                if best_match_distance < self.tolerance:
                    name = self.known_face_names[best_match_index]
                else:
                    name = "Unknown"
                
                face_names.append(name)
                face_distances_list.append(best_match_distance)
            
            # Display results on frame
            for (top, right, bottom, left), name, distance in zip(
                face_locations, face_names, face_distances_list
            ):
                top *= 4
                right *= 4
                bottom *= 4
                left *= 4
                
                # Draw rectangle around face
                color = (0, 255, 0) if name != "Unknown" else (0, 0, 255)
                cv2.rectangle(frame, (left, top), (right, bottom), color, 2)
                
                # Put name and distance
                label = f"{name} ({distance:.2f})" if name != "Unknown" else "Unknown"
                cv2.putText(frame, label, (left + 6, bottom - 6),
                           cv2.FONT_HERSHEY_DUPLEX, 0.6, color, 1)
            
            # Display instructions
            cv2.putText(frame, "SPACE: Capture | Q: Quit", (10, 30),
                       cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
            
            cv2.imshow('Face Authentication', frame)
            
            # Check timeout
            elapsed = (datetime.now() - start_time).total_seconds()
            if elapsed > timeout:
                print(f"⏱️  Timeout! ({timeout} seconds)")
                break
            
            # Key handling
            key = cv2.waitKey(1) & 0xFF
            
            if key == ord('q'):
                print("Cancelled by user")
                break
            elif key == ord(' '):  # Space key
                # Authenticate with current frame
                if face_names and face_names[0] != "Unknown":
                    result = {
                        'authenticated': True,
                        'name': face_names[0],
                        'distance': float(face_distances_list[0]),
                        'message': f'✅ Authentication successful! Welcome, {face_names[0]}!'
                    }
                    video_capture.release()
                    cv2.destroyAllWindows()
                    return result
                else:
                    print("❌ No recognized face detected!")
        
        video_capture.release()
        cv2.destroyAllWindows()
        
        return {
            'authenticated': False,
            'name': 'Unknown',
            'message': 'Authentication failed or cancelled'
        }
    
    def list_registered_users(self):
        """List all registered users in the system."""
        if not self.known_face_names:
            print("No registered users found.")
            return
        
        print("\n📋 Registered Users:")
        unique_names = list(set(self.known_face_names))
        for i, name in enumerate(unique_names, 1):
            count = self.known_face_names.count(name)
            print(f"  {i}. {name} ({count} faces)")
        print()
    
    def remove_person(self, person_name):
        """Remove a person from the authentication system."""
        try:
            # Remove from encodings
            indices_to_remove = [i for i, name in enumerate(self.known_face_names) 
                               if name == person_name]
            
            for i in reversed(indices_to_remove):
                del self.known_face_encodings[i]
                del self.known_face_names[i]
            
            # Remove directory
            person_dir = os.path.join(self.known_faces_dir, person_name)
            if os.path.exists(person_dir):
                import shutil
                shutil.rmtree(person_dir)
            
            # Save updated encodings
            self.save_encodings()
            
            print(f"✅ Successfully removed {person_name}")
            return True
        
        except Exception as e:
            print(f"❌ Error removing {person_name}: {e}")
            return False


def main():
    """Main menu for face authentication system."""
    authenticator = FaceAuthenticator()
    
    while True:
        print("\n" + "="*50)
        print("🔐 FACE AUTHENTICATION SYSTEM")
        print("="*50)
        print("1. Register New User")
        print("2. Authenticate from Camera")
        print("3. Authenticate from Image")
        print("4. List Registered Users")
        print("5. Remove User")
        print("6. Reload Encodings")
        print("7. Exit")
        print("="*50)
        
        choice = input("Select option (1-7): ").strip()
        
        if choice == '1':
            print("\n📸 Register New User")
            person_name = input("Enter person's name: ").strip()
            image_path = input("Enter image path: ").strip()
            
            if os.path.exists(image_path):
                authenticator.add_person_face(person_name, image_path)
            else:
                print("❌ Image file not found!")
        
        elif choice == '2':
            print("\n📷 Camera Authentication")
            result = authenticator.authenticate_from_camera()
            if result['authenticated']:
                print(f"✅ {result['message']}")
            else:
                print(f"❌ {result['message']}")
        
        elif choice == '3':
            print("\n🖼️  Image Authentication")
            image_path = input("Enter image path: ").strip()
            
            if os.path.exists(image_path):
                result = authenticator.authenticate_face(image_path)
                print(f"\n{result['message']}")
                print(f"Distance: {result['distance']:.4f}")
            else:
                print("❌ Image file not found!")
        
        elif choice == '4':
            authenticator.list_registered_users()
        
        elif choice == '5':
            print("\nRemove User")
            person_name = input("Enter person's name to remove: ").strip()
            confirm = input(f"Are you sure you want to remove {person_name}? (yes/no): ").lower()
            if confirm == 'yes':
                authenticator.remove_person(person_name)
        
        elif choice == '6':
            print("\n🔄 Reloading encodings...")
            authenticator.load_or_create_encodings()
        
        elif choice == '7':
            print("\n👋 Goodbye!")
            break
        
        else:
            print("❌ Invalid option. Please try again.")


if __name__ == "__main__":
    main()
