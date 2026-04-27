// Verification script to check that all fixes are working
console.log('🔍 Verifying fixes...');

// Test 1: Check ErrorBoundary import
try {
  const ErrorBoundary = require('./components/common/ErrorBoundary').default;
  console.log('✅ ErrorBoundary import: SUCCESS');
} catch (error) {
  console.log('❌ ErrorBoundary import: FAILED -', error.message);
}

// Test 2: Check AppRoutes import
try {
  const AppRoutes = require('./AppRoutes').default;
  console.log('✅ AppRoutes import: SUCCESS');
} catch (error) {
  console.log('❌ AppRoutes import: FAILED -', error.message);
}

// Test 3: Check useAuth context
try {
  const { useAuth } = require('./context/AuthContext');
  console.log('✅ useAuth context: SUCCESS');
} catch (error) {
  console.log('❌ useAuth context: FAILED -', error.message);
}

console.log('🎉 Verification complete!');
