#include <emscripten.h>
#include <string.h>
#include <time.h>


static char result[64];
static const char* alfabeto = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%&*()1234567890";
static const int indices[256] = {
    ['a']=0,  ['b']=1,  ['c']=2,  ['d']=3,  ['e']=4,
    ['f']=5,  ['g']=6,  ['h']=7,  ['i']=8,  ['j']=9,
    ['k']=10, ['l']=11, ['m']=12, ['n']=13, ['o']=14,
    ['p']=15, ['q']=16, ['r']=17, ['s']=18, ['t']=19,
    ['u']=20, ['v']=21, ['w']=22, ['x']=23, ['y']=24,
    ['z']=25, ['A']=26, ['B']=27, ['C']=28, ['D']=29,
    ['E']=30, ['F']=31, ['G']=32, ['H']=33, ['I']=34,
    ['J']=35, ['K']=36, ['L']=37, ['M']=38, ['N']=39,
    ['O']=40, ['P']=41, ['Q']=42, ['R']=43, ['S']=44,
    ['T']=45, ['U']=46, ['V']=47, ['W']=48, ['X']=49,
    ['Y']=50, ['Z']=51, ['!']=52, ['@']=53, ['#']=54,
    ['$']=55, ['%']=56, ['&']=57, ['*']=58, ['(']=59,
    [')']=60, ['1']=61, ['2']=62, ['3']=63, ['4']=64,
    ['5']=65, ['6']=66, ['7']=67, ['8']=68, ['9']=69,
    ['0']=70
};
static const int alfabeto_len = 71;

extern "C" {

    EMSCRIPTEN_KEEPALIVE
    const char* increment(const char* str) {
        char chars[64];
        strcpy(chars, str);
        int i = strlen(str) -1;
        while(i >= 0){
            const int index = indices[(unsigned char)chars[i]];
            if(index < alfabeto_len - 1){
                chars[i] = alfabeto[index+1];
                strcpy(result, chars);
                return result;
            }
            chars[i] = alfabeto[0];
            i--;
        }
        for(int i = 0; i < strlen(str) + 1;i++){
            result[i] = alfabeto[0];
        }
        result[strlen(str) + 1] = '\0';
        return result;
    }

    EMSCRIPTEN_KEEPALIVE
    int breakPassword(const char* password) {
        char tentativa[64] = "a";
        if(strcmp(tentativa, password) == 0){
            return 0;
        }
        clock_t inicio = clock();
        while(strcmp(tentativa, password) != 0){
            strcpy(tentativa, increment(tentativa));
        }
        return (double)(clock() - inicio) / CLOCKS_PER_SEC * 1000;
    }
    EMSCRIPTEN_KEEPALIVE
    const char* stepN(const char* tentativa, const char* password, int n) {
        char localTry[64];
        strcpy(localTry, tentativa);
        if(strcmp(localTry, password) == 0){
            return NULL;
        }
        for(int i = 0; i < n; i++){
            strcpy(localTry, increment(localTry));
            if(strcmp(localTry, password) == 0){
                return NULL;
            }   
        }
        strcpy(result, localTry);
        return result;
        // copia tentativa pra um buffer local
        // loop n vezes:
        //   incrementa
        //   se achou password: retorna null ou string especial indicando sucesso
        // retorna a tentativa atual depois de n iterações
    }
}