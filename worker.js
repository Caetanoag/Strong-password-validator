importScripts('brute.js')

Module.onRuntimeInitialized = () => {
    self.onmessage = (e) => {
        const password = e.data
        const ms = Module.ccall('breakPassword', 'number', ['string'], [password])
        self.postMessage(ms)
    }
}