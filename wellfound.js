(async () => {
  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  const waitForElement = async (selector, timeout = 5000) => {
    const start = Date.now();
    while (Date.now() - start < timeout) {
      const el = document.querySelector(selector);
      if (el) return el;
      await delay(100);
    }
    return null;
  };

  const applicationText = `Hey,

I’m Yuval — I build data-driven and AI-focused products end-to-end.

I’m not just a “developer” — I focus on turning ideas into working systems that people can actually use. Lately, I’ve been building systems that turn messy, unstructured data into something actually usable — combining scraping, data pipelines, and LLMs to extract real insights.

What I bring:

Strong focus on data + backend systems + AI/ML integration

Experience building full products — from idea → implementation → deployment

Hands-on with APIs, scraping, data pipelines, LLM workflows, and machine learning

Comfortable working across backend, logic, and product decisions

Tech I use regularly:

Backend: FastAPI, Node.js

Data & ML: Python, Pandas, machine learning workflows

AI/LLMs: API-based integrations, prompt workflows

Databases: PostgreSQL, MongoDB

DevOps (basic): AWS, Docker

I care more about building something useful than just stacking technologies.

Work:
GitHub: https://github.com/Yuval-Varke

Project: https://repointel-iqpf.onrender.com/

LinkedIn: https://www.linkedin.com/in/yuval-varke/

X (Twitter): https://x.com/Varke_yuval1704

If you’re looking for someone who can actually build and iterate on real products, I’m in.

— Yuval`;

  let appliedCount = 0;
  let skippedCount = 0;
  let scrollCount = 0;
  let processedButtons = new Set();

  console.log(`%c🚀 Starting smart auto-apply on Wellfound...`, 'color: green; font-weight: bold;');

  const handleRelocationQuestion = async () => {
      try {
          const firstRadio = document.querySelector(
              'input[name="qualification.location.action"]'
          )
          if (firstRadio) {
              firstRadio.click()
              console.log("%c📍 Selected relocation option", "color: orange")
          }

          // Targeting the dropdown specifically by ID
          const dropdownContainer = document.querySelector(
              "#form-input--qualification.location.locationId .select__control"
          )
          if (dropdownContainer) {
              dropdownContainer.click()
              console.log("%c🔽 Opened location dropdown", "color: orange")
              await delay(500)

              const firstOption = document.querySelector(
                  ".select__menu-list div"
              )
              if (firstOption) {
                  firstOption.click()
                  console.log(
                      "%c🌍 Selected first location in dropdown",
                      "color: orange"
                  )
              }

              await delay(2000)
              return true
          } else {
              console.log("%c⚠️ Dropdown not found", "color: gray")
          }
      } catch (err) {
          console.log(
              "%c❌ Error while handling relocation question",
              "color: red",
              err
          )
      }
      return false
  }

  const handleCustomQuestions = () => {
      const allGroups = document.querySelectorAll(
          '[data-test^="RadioGroup-customQuestionAnswers"]'
      )

      allGroups.forEach((group) => {
          const options = group.querySelectorAll('input[type="radio"]')
          if (options.length === 3) {
              options[1].click() // middle
              console.log(
                  "%c🎯 Selected Intermediate for 3-option question",
                  "color: dodgerblue"
              )
          } else if (options.length === 2) {
              options[0].click() // first
              console.log(
                  "%c🎯 Selected Beginner for 2-option question",
                  "color: dodgerblue"
              )
          } else {
              console.log(
                  "%c⚠️ Unexpected number of options: " + options.length,
                  "color: gray"
              )
          }
      })
  }

  const processBatch = async () => {
    let buttons = [...document.querySelectorAll('button[data-test="LearnMoreButton"]')];
    buttons = buttons.filter(btn => !processedButtons.has(btn));

    if (buttons.length === 0) return false;

    for (let i = 0; i < buttons.length; i++) {
      const learnMoreBtn = buttons[i];
      processedButtons.add(learnMoreBtn);

      learnMoreBtn.scrollIntoView({ behavior: "smooth", block: "center" });
      await delay(300);
      learnMoreBtn.click();
      console.log(`%c🔍 [${appliedCount + skippedCount + 1}] Opened job modal...`, 'color: blue');

      const applyBtn = await waitForElement('button[data-test="JobDescriptionSlideIn--SubmitButton"]');
      if (!applyBtn) {
        console.log('%c❌ Modal failed to load', 'color: red');
        skippedCount++;
        continue;
      }

      // If apply button is disabled, skip fast
      if (applyBtn.disabled) {
        // Step 1: Handle relocation questionnaire if visible
        const isFormFilled = await handleRelocationQuestion()

        if (isFormFilled) {
          console.log('%c✅ Relocation questionnaire filled', 'color: green');
        } else {
          console.log('%c⚠️ Relocation questionnaire not filled', 'color: orange');
          console.log("%c⏭️ Apply button is disabled — skipping", "color: gray")
        }

        const closeBtn = await waitForElement('button[data-test="closeButton"]');
        if (closeBtn) closeBtn.click();
        skippedCount++;
        await delay(500);
        continue;
      }

      handleCustomQuestions()

      // Step 2: Fill application text
      const textarea = document.querySelector('textarea:not([disabled])');
      if (textarea) {
        textarea.value = applicationText;
        textarea.dispatchEvent(new Event('input', { bubbles: true }));
        console.log(`%c📝 Autofilled application`, 'color: purple');
      }

      await delay(1000)

      // Step 3: Click Apply
      applyBtn.click();
      await delay(3000)
      appliedCount++;
      console.log('%c✅ Applied successfully', 'color: teal');

      // Step 4: Close modal
      const closeBtn = await waitForElement('button[data-test="closeButton"]');
      if (closeBtn) {
        closeBtn.click();
        console.log('%c❎ Modal closed', 'color: crimson');
      }

      await delay(1000);
    }

    return true;
  };

  // Infinite scroll loop
  const maxScrolls = 10;
  while (scrollCount < maxScrolls) {
    const found = await processBatch();
    if (!found) {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      console.log(`%c📜 Scrolling to load more jobs...`, 'color: darkcyan');
      scrollCount++;
      await delay(2000);
    } else {
      scrollCount = 0; // reset if found new jobs
    }
  }

  // Summary
  console.log('%c🎉 All done! Smart auto-apply finished.', 'color: limegreen; font-size: 16px; font-weight: bold;');
  console.log(`%c📌 Jobs Applied: ${appliedCount}`, 'color: #4CAF50; font-weight: bold;');
  console.log(`%c📌 Jobs Skipped: ${skippedCount}`, 'color: #FF9800; font-weight: bold;');
})();
