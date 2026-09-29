(() => {
  document.querySelectorAll('[data-slider]').forEach((slider) => {
    const track = slider.querySelector('.slider__track');
    const slides = [...(track?.children || [])];
    if (!track || !slides.length) return;
    let current = 0;
    const render = () => {
      const maxOffset = Math.max(0, track.scrollWidth - slider.clientWidth);
      const slideOffset = Math.max(0, slides[current].offsetLeft - track.offsetLeft);
      track.style.transform = `translateX(-${Math.min(slideOffset, maxOffset)}px)`;
    };
    slider.querySelector('[data-slider-next]')?.addEventListener('click', () => {
      current = (current + 1) % slides.length;
      render();
    });
    slider.querySelector('[data-slider-prev]')?.addEventListener('click', () => {
      current = (current - 1 + slides.length) % slides.length;
      render();
    });
    window.addEventListener('resize', render);
    render();
  });
})();
