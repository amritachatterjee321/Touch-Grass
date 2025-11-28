import { useState } from 'react'
import { Button } from './ui/button'
import { useFirebase } from '../contexts/FirebaseContext'
import { db } from '../firebase/config'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { toast } from 'sonner'

export function FirebaseDiagnostic() {
  const { user } = useFirebase()
  const [diagnosticResults, setDiagnosticResults] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const addResult = (result: string) => {
    setDiagnosticResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${result}`])
  }

  const clearResults = () => {
    setDiagnosticResults([])
  }

  const runDiagnostic = async () => {
    if (!user) {
      addResult('❌ No user authenticated')
      return
    }

    setLoading(true)
    clearResults()
    
    try {
      addResult('🔄 Starting Firebase diagnostic...')
      
      // Test 1: Check Firebase config
      addResult(`📋 Project ID: ${db.app.options.projectId}`)
      addResult(`📋 Database URL: ${db.app.options.databaseURL || 'Not set'}`)
      
      // Test 2: Try to read a document
      addResult('🔄 Testing read permissions...')
      const testDocRef = doc(db, 'chats', 'test-read')
      const testDoc = await getDoc(testDocRef)
      addResult(`✅ Read test: ${testDoc.exists() ? 'Document exists' : 'Document does not exist (but read worked)'}`)
      
      // Test 3: Try to write a document
      addResult('🔄 Testing write permissions...')
      const writeTestRef = doc(db, 'diagnostic', `test-${user.uid}`)
      await setDoc(writeTestRef, {
        test: true,
        userId: user.uid,
        timestamp: new Date().toISOString()
      })
      addResult('✅ Write test: Successfully wrote diagnostic document')
      
      // Test 4: Try to read the written document
      addResult('🔄 Testing read-back of written document...')
      const readBackDoc = await getDoc(writeTestRef)
      if (readBackDoc.exists()) {
        addResult('✅ Read-back test: Successfully read written document')
      } else {
        addResult('❌ Read-back test: Could not read written document')
      }
      
      // Test 5: Check user authentication details
      addResult(`👤 User UID: ${user.uid}`)
      addResult(`👤 User Email: ${user.email}`)
      addResult(`👤 User Name: ${user.displayName || 'Not set'}`)
      addResult(`👤 Auth Provider: ${user.providerData[0]?.providerId || 'Unknown'}`)
      
      addResult('✅ Firebase diagnostic completed successfully!')
      
    } catch (error: any) {
      addResult(`❌ Diagnostic failed: ${error.message}`)
      addResult(`🔍 Error code: ${error.code || 'No code'}`)
      addResult(`🔍 Full error: ${JSON.stringify(error)}`)
      console.error('Firebase diagnostic error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 space-y-4 border rounded-lg bg-blue-50">
      <h3 className="text-lg font-bold">Firebase Diagnostic</h3>
      
      <div className="space-y-2">
        <div className="flex gap-2">
          <Button 
            onClick={runDiagnostic} 
            disabled={loading || !user}
            className="bg-blue-500 hover:bg-blue-600"
          >
            {loading ? 'Running...' : 'Run Diagnostic'}
          </Button>
          <Button 
            onClick={clearResults}
            variant="outline"
          >
            Clear Results
          </Button>
        </div>
        
        <p className="text-sm text-gray-600">
          This will test Firebase connectivity, permissions, and configuration.
        </p>
      </div>
      
      {diagnosticResults.length > 0 && (
        <div className="bg-black text-green-400 p-3 rounded font-mono text-sm max-h-60 overflow-y-auto">
          {diagnosticResults.map((result, index) => (
            <div key={index}>{result}</div>
          ))}
        </div>
      )}
    </div>
  )
}

