module.exports = {
    assets: ['./assets/fonts/'],
    dependencies: {
        'react-native-root-view-background': {
            platforms: {
                android: {
                    "packageImportPath": "import com.reactlibrary.RNRootViewBackgroundPackage;",
                    "packageInstance": "new RNRootViewBackgroundPackage()"
                }
            }
        }
    }
};