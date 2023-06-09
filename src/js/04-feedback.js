;(() => {
  'use strict'

  const feedbackCard = document.querySelector('section.feedback-section')
  if (!feedbackCard) return

  const feedbackOptionButtons = feedbackCard.querySelectorAll('div.feedback-options button')

  const feedbackAckMsgDiv = feedbackCard.querySelector('div.feedback-ack')
  const feedbackSecondRow = feedbackCard.querySelector('div.feedback-second-row')

  const giveFeedbackButtons = feedbackCard.querySelectorAll('button.give-feedback')

  const feedbackFormDiv = feedbackCard.querySelector('div.feedback-form')
  const feedbackForm = feedbackFormDiv?.querySelector('form')
  const feedbackFormCancelButton = feedbackForm?.querySelector('input[name="cancel"]')
  const feedbackFormSubmitButton = feedbackForm?.querySelector('input[name="submit"]')

  const feedbackFormThankYouSign = feedbackCard.querySelector('span.feedback-form-thank-you')

  const decision = ['Yes', 'No']
  const inputNamesWithValidation = ['feedback', 'email']
  // const gusURL = 'http://localhost:3000/api/gus/workitem'
  let voted
  let feedbackSubmitted

  const addListeners = (feedbackCard, decision) => {
    decision.forEach((decision) => {
      const feedbackButton = feedbackCard.querySelector(`button.feedback-${decision.toLowerCase()}`)
      const feedbackButtonHelpText = feedbackCard.querySelector(`p#feedback-${decision.toLowerCase()}-help-text`)
      if (feedbackButton) {
        feedbackButton.addEventListener('click', (e) => track(decision, e))
        feedbackButton.addEventListener('mouseover', () => show(feedbackButtonHelpText))
        feedbackButton.addEventListener('mouseout', () => hide(feedbackButtonHelpText))
        feedbackButton.addEventListener('focus', () => show(feedbackButtonHelpText))
        feedbackButton.addEventListener('blur', () => hide(feedbackButtonHelpText))
      }
    })

    giveFeedbackButtons.forEach((button) => {
      button.addEventListener('click', (e) => {
        e.preventDefault()
        hide(button)
        show(feedbackFormDiv)
        feedbackForm.querySelector('input').focus()
      })
    })

    addValidationListeners(inputNamesWithValidation)

    if (feedbackFormCancelButton) {
      feedbackFormCancelButton.addEventListener('click', (e) => {
        e.preventDefault()
        e.stopImmediatePropagation()
        hide(feedbackFormDiv)
        removeAllValidationVizIfValid(inputNamesWithValidation)
        if (voted) {
          show(feedbackSecondRow)
          show(giveFeedbackButtons[1])
          giveFeedbackButtons[1].focus()
        } else {
          show(giveFeedbackButtons[0])
          giveFeedbackButtons[0].focus()
        }
      })
    }

    if (feedbackForm) {
      feedbackForm.addEventListener('submit', (e) => {
        e.preventDefault()
        removeAllValidationVizIfValid(inputNamesWithValidation)
        createGUSWorkItem(feedbackForm)
        hide(feedbackFormDiv)
        show(feedbackFormThankYouSign)
        feedbackSubmitted = true
        voted
          ? feedbackFormThankYouSign.focus()
          : feedbackOptionButtons[0].focus()
      })

      feedbackFormSubmitButton.addEventListener('click', () => {
        removeAllValidationVizIfValid(inputNamesWithValidation)
      })
    }
  }

  const addValidationListeners = (inputNames) => {
    inputNames.forEach((inputName) => {
      const input = document.querySelector(`input#${inputName}`)
      if (input) {
        const validationText = document.querySelector(`span#${inputName}-validation-text`)
        input.addEventListener('invalid', (e) => {
          e.preventDefault()
          show(validationText)
          addValidationViz(input)
          input.ariaInvalid = true
          input.setAttribute('aria-describedby', `${inputName}-validation-text`)
        })
      }
    })
  }

  const addValidationViz = (element) => element.classList.add('invalid')

  const createBody = (form) => {
    const formData = new FormData(form) // eslint-disable-line
    return {
      pageURL: document.location.href,
      subject: formData.get('feedback'),
      detail: formData.get('feedback-detail') || 'not provided',
      name: formData.get('name') || 'not provided',
      email: formData.get('email') || 'not provided',
    }
  }

  const createGUSWorkItem = (form) => {
    const body = createBody(form)
    console.log(body)

    // // TODO: send the form to GUS
    // fetch(gusURL, {
    //   credentials: "same-origin",
    //   mode: 'no-cors',
    //   // body,
    //   headers: {
    //     // Authorization: 'Bearer fakeToken',
    //     'Content-Type': 'application/json',
    //   },
    //   method: 'POST',
    // }).then(response => response.json())
    //   .then(data => console.log(data))
    //   .catch(err => console.error(err))
  }

  const focusOnFirstInvalidInput = (feedbackForm) => {
    const firstInvalidInput = feedbackForm?.querySelector('input.invalid')
    if (firstInvalidInput) firstInvalidInput.focus()
  }

  const hide = (element) => {
    if (element) element.classList.add('hide')
  }

  const removeAllValidationVizIfValid = (inputNames) => {
    inputNames.forEach((inputName) => {
      const input = document.querySelector(`input#${inputName}`)
      const validationText = document.querySelector(`span#${inputName}-validation-text`)
      if (input.checkValidity()) removeValidationViz(input, validationText)
    })
    focusOnFirstInvalidInput(feedbackForm)
  }

  const removeValidationViz = (input, validationText) => {
    if (input) {
      input.classList.remove('invalid')
      input.removeAttribute('aria-describedby')
      input.removeAttribute('aria-invalid')
    }
    if (validationText) validationText.classList.add('hide')
  }

  const show = (element) => {
    if (element) element.classList.remove('hide')
  }

  const track = (decision, e) => {
    voted = true
    try {
      if (window.analytics) {
        window.analytics.track(`Clicked Helpful ${decision}`, {
          title: document.title,
          url: window.location.href,
        })
      }
      feedbackOptionButtons.forEach((button) => hide(button))
      show(feedbackAckMsgDiv)
      updateFeedbackAckMsg(feedbackAckMsgDiv, decision)
      if (!feedbackSubmitted) {
        show(feedbackFormDiv)
        feedbackForm.querySelector('input').focus()
      }
    } catch (error) {
      console.warn(error)
    }
    if (e) e.preventDefault()
  }

  const updateFeedbackAckMsg = (feedbackAckMsgDiv, decision) => {
    const msg = feedbackAckMsgDiv.querySelector('p')
    if (msg) msg.innerText += ` ${decision}`
  }

  addListeners(feedbackCard, decision)
})()
