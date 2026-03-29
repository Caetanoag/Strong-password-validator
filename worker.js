importScripts('brute.js')

Module.onRuntimeInitialized = () => {
        let rodando = false;
        self.onmessage = (e) => {
        rodando = false 
        
        setTimeout(() => {  
            const { password, totalTentativas } = e.data
            let tentativa = "a"
            let count = 0
            const N = 1_000_000
            rodando = true

            function loop() {
                if (!rodando) return
                
                const resultado = Module.ccall('stepN', 'number', ['string', 'string', 'number'], [tentativa, password, N])
                count += N

                if (resultado === 0) {
                    self.postMessage({ tipo: 'found', count })
                    return
                }

                tentativa = UTF8ToString(resultado)
                self.postMessage({ tipo: 'progress', tentativa, count, totalTentativas })
                setTimeout(loop, 0)
            }

            loop()
        }, 0)
    }
}