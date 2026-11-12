(() => {
  const getDeals = () => Storage.get(Storage.KEYS.DEALS);
  const findDeal = id => getDeals().find(deal => String(deal.id) === id);
  const dialog = document.getElementById('dealPlan');
  const taskList = document.getElementById('dealFollowUpsList');

  if (dialog) {
    const form = document.getElementById('dealPlanForm');
    const fields = form.elements;
    const feedback = document.getElementById('dealPlanFeedback');
    const calendarLink = document.getElementById('dealPlanCalendar');
    const tasksLink = document.getElementById('dealPlanTasks');
    const board = document.querySelector('.kanban-board');
    let dealId;
    let opener;

    function updateDealLink(id) {
      const url = new URL(location.href);
      if (id) url.searchParams.set('deal', id);
      else url.searchParams.delete('deal');
      history.replaceState(history.state, '', url);
    }

    function openDeal(id) {
      const deal = findDeal(id);
      if (!deal) return;
      dealId = id;
      const plan = deal.plan;
      document.getElementById('dealPlanTitle').textContent = deal.title;
      document.getElementById('dealPlanCustomer').textContent = deal.customer;
      fields.stage.value = normalizePipelineStage(deal.stage);
      fields.appointment.value = plan?.appointment || '';
      fields.date.value = plan?.date || localDateKey(new Date());
      fields.time.value = plan?.time || '';
      fields.task.value = plan?.task || '';
      fields.dueDate.value = plan?.dueDate || fields.date.value;
      fields.dueDate.setCustomValidity('');
      feedback.textContent = plan?.completed ? 'Task completed.' : '';
      calendarLink.hidden = tasksLink.hidden = !plan;
      if (plan) calendarLink.href = 'calendar.html?date=' + encodeURIComponent(plan.date);
      if (!dialog.open) {
        updateDealLink(id);
        dialog.showModal();
      }
    }

    board.addEventListener('click', event => {
      const trigger = event.target.closest('[data-deal-open]');
      if (trigger) {
        opener = trigger;
        openDeal(trigger.closest('.kanban-card').dataset.id);
      }
    });
    document.getElementById('closeDealPlan').addEventListener('click', () => dialog.close());
    dialog.addEventListener('close', () => {
      updateDealLink(null);
      const card = [...board.querySelectorAll('.kanban-card')].find(item => item.dataset.id === dealId);
      const focusTarget = opener?.isConnected ? opener : card?.querySelector('.deal-open');
      if (focusTarget?.getClientRects().length) focusTarget.focus();
      else document.getElementById('pipelineStageFilter')?.focus();
      opener = null;
    });
    fields.date.addEventListener('input', () => fields.dueDate.setCustomValidity(''));
    fields.dueDate.addEventListener('input', () => fields.dueDate.setCustomValidity(''));
    form.addEventListener('submit', event => {
      event.preventDefault();
      const deal = findDeal(dealId);
      if (!deal) {
        feedback.textContent = 'This deal is no longer in the pipeline.';
        return;
      }
      for (const field of [fields.appointment, fields.task]) field.value = field.value.trim();
      if (fields.dueDate.value < fields.date.value) {
        fields.dueDate.setCustomValidity('The due date must be on or after the appointment date.');
      }
      if (!form.reportValidity()) return;

      const appointment = fields.appointment.value;
      const date = fields.date.value;
      const time = fields.time.value;
      const task = fields.task.value;
      const dueDate = fields.dueDate.value;
      const unchangedTask = deal.plan?.task === task && deal.plan.dueDate === dueDate;
      const stage = normalizePipelineStage(fields.stage.value);
      Storage.updateItem(Storage.KEYS.DEALS, dealId, {
        stage,
        probability: stage === normalizePipelineStage(deal.stage) ? deal.probability : undefined,
        plan: { appointment, date, time, task, dueDate, completed: unchangedTask && Boolean(deal.plan.completed) }
      });
      openDeal(dealId);
      feedback.textContent = 'Saved. You can now open this deal\'s appointment or task.';
    });
    const linkedDeal = new URLSearchParams(location.search).get('deal');
    if (linkedDeal) document.addEventListener('DOMContentLoaded', () => openDeal(linkedDeal));
  }

  if (taskList) {
    function renderFollowUps() {
      const deals = getDeals().filter(deal => deal.plan);
      document.getElementById('dealFollowUpsEmpty').hidden = deals.length > 0;
      taskList.replaceChildren();
      deals.forEach(deal => {
        const row = document.createElement('article');
        row.className = 'deal-follow-up-row';
        const copy = document.createElement('div');
        const title = document.createElement('h3');
        title.textContent = deal.plan.task;
        const context = document.createElement('p');
        context.textContent = deal.title + ' (' + deal.customer + '). Due ' + formatShortDate(deal.plan.dueDate);
        const link = document.createElement('a');
        link.href = 'pipeline.html?deal=' + encodeURIComponent(deal.id);
        link.textContent = 'Open deal';
        copy.append(title, context, link);
        const status = document.createElement('button');
        status.type = 'button';
        status.className = 'btn btn-secondary';
        status.dataset.completeDeal = deal.id;
        status.setAttribute('aria-pressed', String(Boolean(deal.plan.completed)));
        status.textContent = deal.plan.completed ? 'Completed' : 'Mark complete';
        row.append(copy, status);
        taskList.append(row);
      });
    }
    taskList.addEventListener('click', event => {
      const button = event.target.closest('[data-complete-deal]');
      if (!button) return;
      const deal = findDeal(button.dataset.completeDeal);
      if (!deal?.plan) return;
      const completed = !deal.plan.completed;
      Storage.updateItem(Storage.KEYS.DEALS, deal.id, { plan: { ...deal.plan, completed } });
      button.setAttribute('aria-pressed', String(completed));
      button.textContent = completed ? 'Completed' : 'Mark complete';
    });
    renderFollowUps();
  }
})();
