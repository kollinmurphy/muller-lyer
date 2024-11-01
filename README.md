# Muller-Lyer Illusion Data Collection Application

## Firestore Security Rules

```
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /userData/{documentId} {
      allow create: if request.auth != null && request.auth.uid == documentId;
      allow read: if request.auth != null && request.auth.uid == documentId;
      allow update: if request.auth != null && request.auth.uid == documentId;
    }

    match /responseData/{documentId} {
      allow create: if request.auth != null && request.auth.uid == documentId;
      allow read: if request.auth != null && request.auth.uid == documentId;
      allow update: if request.auth != null && request.auth.uid == documentId;
    }
  }
}
```
