importScripts('brute.js')

Module.onRuntimeInitialized = () => {

        const RUNS = 5
        let total = 0
        for (let i = 0; i < RUNS; i++) {
            const inicio = performance.now()
            Module.ccall('stepN', 'number', ['string', 'string', 'number'], ['a', 'aaaaaa', 100_000])
            total += performance.now() - inicio
        }
        const msPorTentativa = (total / RUNS) / 100_000
        self.postMessage({ tipo: 'benchmark', msPorTentativa })

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