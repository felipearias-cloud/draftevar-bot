# DrafteVAR Bot

Bot que escucha mensajes en un canal de Slack y menciona automáticamente al agente @DrafteVAR en el hilo para que responda.

## Variables de entorno (configurar en Vercel)

| Variable | Valor |
|---|---|
| `SLACK_BOT_TOKEN` | `xoxb-...` (tu Bot User OAuth Token) |
| `SLACK_CHANNEL_ID` | `C0AHVNHNMA7` |
| `DRAFTEVAR_USER_ID` | ID de usuario del bot DrafteVAR (ver abajo) |

## Cómo obtener el DRAFTEVAR_USER_ID

1. En Slack, haz clic en el nombre de @DrafteVAR
2. Ver perfil → los 3 puntos `...` → "Copy member ID"
3. Será algo como `U08ABC123`

## Pasos de despliegue

1. Sube esta carpeta a un repositorio de GitHub
2. En Vercel, importa el repositorio
3. Agrega las variables de entorno
4. Despliega — Vercel te dará una URL como `https://draftevar-bot.vercel.app`

## Configurar Event Subscriptions en Slack

1. Ve a tu app en api.slack.com → **Event Subscriptions**
2. Activa **Enable Events**
3. En **Request URL** pon: `https://TU-URL.vercel.app/api/events`
4. En **Subscribe to bot events** agrega: `message.channels`
5. Guarda y reinstala la app
