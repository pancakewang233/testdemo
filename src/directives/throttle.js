export default {
  inserted(el, binding, vnode) {
    const delay = binding.arg ? Number(binding.arg) : 3000

    const button = el.tagName === 'BUTTON'
      ? el
      : el.querySelector('button')

    if (!button) return

    const instance = vnode.componentInstance

    const handler = function(e) {
      if (button.disabled) {
        e.preventDefault()
        e.stopPropagation()
        return
      }

      binding.value(e)

      if (instance) {
        instance.loading = true
        instance.disabled = true
      }
      button.classList.add('is-disabled', 'is-loading')
      button.disabled = true

      setTimeout(function() {
        if (instance) {
          instance.loading = false
          instance.disabled = false
        }
        button.classList.remove('is-disabled', 'is-loading')
        button.disabled = false
      }, delay)
    }

    button.__throttleHandler__ = handler
    button.addEventListener('click', handler, true)
  },

  unbind(el) {
    const button = el.tagName === 'BUTTON'
      ? el
      : el.querySelector('button')

    if (button && button.__throttleHandler__) {
      button.removeEventListener('click', button.__throttleHandler__, true)
      delete button.__throttleHandler__
    }
  }
}
