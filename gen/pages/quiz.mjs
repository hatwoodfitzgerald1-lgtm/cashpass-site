import { page } from '../partials/layout.mjs';
import { planCard, PLANS, hero, edgeDivider } from '../partials/components.mjs';
import { esc, picture, PHOTO_ALT, cardMark, icon } from '../lib/html.mjs';

const QUESTIONS = [
  { id: 'q1', legend: 'How many cards do you carry?', icon: 'card', options: ['One to three', 'Four or more', 'Four or more, and so does someone I live with'] },
  { id: 'q2', legend: 'Where does most of your spending go?', icon: 'household', options: ['Groceries and everyday shops', 'Restaurants and fuel', 'Online', 'It\'s spread all over'] },
  { id: 'q3', legend: 'Do you activate your rotating categories every quarter?', icon: 'quarter', options: ['Every quarter', 'Sometimes', 'I forget', 'I don\'t have one'] }
];

function tool() {
  const fieldsets = QUESTIONS.map((q, qi) => `<fieldset class="qf" data-qf="${q.id}">
    <legend class="qf-legend">${icon(q.icon, 'qf-ic')}<span class="qf-text">${esc(q.legend)}</span></legend>
    <p class="field-err qf-err" id="${q.id}-err" hidden></p>
    <div class="opts">${q.options.map((o, oi) => `<label class="opt"><input class="opt-in" type="radio" name="${q.id}" value="${oi}" id="${q.id}-${oi}" data-q="${q.id}"><span class="opt-box" aria-hidden="true"></span><span class="opt-text">${esc(o)}</span></label>`).join('')}</div>
  </fieldset>`).join('');
  const cards = PLANS.order.map((id) => planCard(id, { compact: true, dark: true, headingLevel: 2, showCta: false, lit: false, idPrefix: 'stage-plan' })).join('');
  return `<section class="tool hero hero--quiz" aria-labelledby="quiz-h1" data-in="deal-questions">
  <div class="hero-in">
    <p class="eyebrow">Find your plan</p>
    <h1 class="h1" id="quiz-h1">Three questions, one light.</h1>
    <p class="intro">Answer three things about your wallet. The light walks to the plan that fits, and you'll see the till line you'd actually get.</p>
  </div>
  <div class="tool-grid">
    <form class="quiz" data-quiz novalidate aria-describedby="quiz-progress">
      ${fieldsets}
      <p class="quiz-progress" id="quiz-progress" data-progress aria-live="polite"></p>
      <p class="quiz-hint" data-hint hidden>Change any answer and the light moves.</p>
    </form>
    <div class="tool-rail">
      <div class="light-stage" data-light-stage aria-hidden="true">
        <div class="ls-cards">${cards}</div>
        <div class="ls-glass"><div class="pool pool--off" data-ls-pool></div><div class="glass-reflect"></div></div>
      </div>
    </div>
  </div>
</section>`;
}

function marquee() {
  const line = 'Lantern Row Market · Route 9 Fuel · Online marketplace · Somewhere else · Lantern Row Cafe';
  return `<section class="marquee" aria-hidden="true" data-in="marquee-start" data-marquee>
  <div class="mq-track" data-mq-track><span class="mq-line">${esc(line)}</span><span class="mq-line" aria-hidden="true">${esc(line)}</span><span class="mq-line" aria-hidden="true">${esc(line)}</span></div>
</section>`;
}

function result() {
  return `<section class="result band" aria-labelledby="result-h" data-result>
  <div class="band-bg">${picture('photo-quiz-01', { alt: PHOTO_ALT['photo-quiz-01'], sizes: '100vw', cls: 'pic--cover' })}</div>
  <div class="band-in result-in">
    <div class="result-region" data-result-region tabindex="0" role="group" aria-labelledby="result-h">
      <p class="result-prompt" data-result-prompt>Three questions. Then one light comes on.</p>
      <div class="result-body" data-result-body hidden>
        <h2 class="answer answer--result" id="result-h" tabindex="-1" data-result-line aria-label=""><span class="answer-txt" aria-hidden="true"></span></h2>
        ${edgeDivider('result-edge')}
        <p class="result-till-label">The till line you'd get</p>
        <p class="result-till" data-result-till></p>
        <p class="result-how-label">How it decided</p>
        <ol class="result-reasons" data-result-reasons></ol>
        <p class="result-lower" data-result-lower hidden>If you would like the quarterly reminders, Pass adds them for $59 a year.</p>
      </div>
    </div>
    <div class="result-plan" data-result-plan hidden>
      <div class="result-card" data-result-card></div>
      <p class="result-others" data-result-others></p>
      <p class="example">Example figures. Rewards are set and paid by your issuer.</p>
    </div>
    <p class="vh" role="status" aria-live="polite" data-result-live></p>
  </div>
</section>`;
}

export function render() {
  const main = [
    tool(), marquee(), result()
  ].join('\n');
  return page({
    route: '/quiz', title: 'Find your plan',
    description: 'Three questions about your wallet. The light lands on the plan that fits, with the till line you\'d actually get.',
    bodyClass: 'page-quiz', hover: 'brighten', main, script: 'quiz', navCta: 'rimmed'
  });
}
