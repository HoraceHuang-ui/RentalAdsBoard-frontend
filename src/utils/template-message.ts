import { createApp, nextTick, ref } from 'vue'
import type { Component } from 'vue'

export function useMessage(component: Component, props: Record<string, any> = {}) {
  const app = createApp(component, props)
  const dom = document.createElement('div')

  function unmount() {
    app.unmount()
    document.body.removeChild(dom)
  }

  const show = ref(false)
  app.provide('app/showMessage', show)
  app.provide('app/unmountMessage', unmount)
  app.mount(dom)
  document.body.appendChild(dom)
  nextTick(() => {
    show.value = true
  })

  function hide() {
    show.value = false
    unmount()
  }

  return {
    hide
  }
}

type MsgType = 'info' | 'alert' | 'success' | 'warn'

export function sysMsgProps(msg?: string, msgType?: MsgType, msgTimeout?: number) {
  return {
    msg: msg,
    type: msgType as string,
    timeout: msgTimeout
  }
}

export function chatMsgProps(
  userFrom: string,
  msg?: string,
  onClick?: Function,
  msgTimeout?: number
) {
  return {
    msg: msg,
    timeout: msgTimeout,
    userFrom: userFrom,
    onClick: onClick
  }
}
