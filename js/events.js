const eventsViewport = document.querySelector("#events-viewport");
const eventsTrack = document.querySelector("#events-track");
const eventsPrev = document.querySelector("#events-prev");
const eventsNext = document.querySelector("#events-next");

if (eventsViewport && eventsTrack && eventsPrev && eventsNext) {
  /*
    Лента имеет внутренние отступы по бокам, поэтому scrollLeft в крайнем
    левом положении равен не нулю, а величине отступа. Учитываем это,
    иначе стрелка «назад» остаётся активной в самом начале.
  */
  function getScrollBounds() {
    const styles = getComputedStyle(eventsViewport);
    const paddingLeft = parseFloat(styles.paddingLeft) || 0;
    const paddingRight = parseFloat(styles.paddingRight) || 0;

    const maxScroll = eventsViewport.scrollWidth - eventsViewport.clientWidth;
    const minScroll = paddingLeft;
    // Правый предел: докуда реально можно доехать при текущем содержимом
    const maxScrollLeft = Math.max(minScroll, maxScroll);

    return { minScroll, maxScrollLeft, paddingRight };
  }

  function updateEventsArrows() {
    const { minScroll, maxScrollLeft } = getScrollBounds();
    const hasOverflow = maxScrollLeft - minScroll > 1;
    const pos = eventsViewport.scrollLeft;

    eventsPrev.disabled = !hasOverflow || pos <= minScroll + 1;
    eventsNext.disabled = !hasOverflow || pos >= maxScrollLeft - 1;
  }

  function scrollEvents(direction) {
    const firstCard = eventsTrack.querySelector(".event-card");

    if (!firstCard) {
      return;
    }

    const trackStyles = getComputedStyle(eventsTrack);
    const gap = parseFloat(trackStyles.columnGap) || 0;
    const distance = firstCard.getBoundingClientRect().width + gap;

    eventsViewport.scrollBy({
      left: direction * distance,
      behavior: "smooth",
    });
  }

  eventsPrev.addEventListener("click", () => scrollEvents(-1));
  eventsNext.addEventListener("click", () => scrollEvents(1));

  eventsViewport.addEventListener("scroll", updateEventsArrows, {
    passive: true,
  });

  window.addEventListener("resize", updateEventsArrows);

  updateEventsArrows();
}
