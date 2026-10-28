# Android no Windows

O projeto usa Expo SDK 58 e React Native 0.88. O ambiente Android deste computador usa JDK 17, API 37, Build-Tools 37.0.0, NDK 27.1.12297006 e CMake 3.22.1.

## Ativar o ambiente

No PowerShell, entre na pasta da aplicação e ative o JDK Android:

```powershell
# A partir da raiz do repositório:
cd jambu
. .\scripts\android-env.ps1
```

O ponto seguido de espaço executa o script no terminal atual. Execute essa ativação em cada novo terminal usado para compilar Android. O Java padrão do Windows continua disponível nos outros terminais, inclusive para trabalhar na API Jambu, que usa Java 21.

Os caminhos ficam nas variáveis de usuário `ANDROID_HOME` e `JAMBU_ANDROID_JAVA_HOME`. O script consulta essas variáveis e configura `JAVA_HOME` e `PATH` apenas no processo atual.

## Conferir as ferramentas

```powershell
java -version
javac -version
adb version
emulator -list-avds
emulator -accel-check
```

## Compilar e executar o aplicativo

Abra o dispositivo virtual pelo Device Manager do Android Studio ou conecte um celular Android com depuração USB autorizada. Confira a conexão:

```powershell
adb devices -l
```

O dispositivo precisa aparecer com o estado `device`. Se aparecer `unauthorized`, confira a tela do Android e confirme **Permitir depuração USB**, marcando **Sempre permitir neste computador**. Execute `adb devices -l` novamente depois da confirmação. Essa autorização também pode ser necessária no primeiro uso de um celular físico.

Depois, no mesmo terminal com o ambiente ativado:

```powershell
npx expo run:android
```

Esse comando gera a pasta nativa `android/`, compila e instala o aplicativo no dispositivo. A primeira execução também baixa o Gradle e dependências nativas. Não edite os arquivos nativos gerados manualmente; mantenha as configurações no Expo.

Depois de instalado, quando as mudanças forem apenas JavaScript ou TypeScript:

```powershell
npx expo start
```

Pressione `a` para abrir no Android. Ao acrescentar dependências com código nativo ou alterar configurações nativas, compile novamente com `npx expo run:android`.

A configuração das ferramentas não substitui a validação do aplicativo. A tela de login é demonstrativa e não realiza autenticação.

## Referências

- [Requisitos do Expo SDK 58](https://docs.expo.dev/versions/v58.0.0/)
- [Compilação local com Expo](https://docs.expo.dev/guides/local-app-development/)
- [Conexão e autorização ADB](https://developer.android.com/tools/adb)
