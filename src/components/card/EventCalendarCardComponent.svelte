<script>
  import { link } from "svelte-spa-router";
  import Lazy from "svelte-lazy";

  import { truncate } from "lodash";

  import { ASSETS } from "../../lib/config";

  export let event;
  export let eventCalendar;
  export let eventCalendarTitle;
  export let eventCalendarThumb;
  export let eventCalendarExc;
</script>

<div
  class="__activity-card duration-300 shadow hover:shadow-lg rounded-[11px] mx-[20px]"
>
  <div class="__card-image">
    <Lazy height={300} fadeOption={{ delay: 500, duration: 1000 }}>
      <img
        class="w-full h-[300px] lg:h-[230px] object-cover rounded-t-[11px]"
        src={`${ASSETS}/${eventCalendarThumb}`}
        alt={eventCalendarTitle}
      />
    </Lazy>
  </div>
  <div class="__card-body px-5 py-6">
    <h1 class="__card-title capitalize font-bold text-xl pb-[1rem]">
      {eventCalendarTitle}
    </h1>
    <span class="text-sky-700"
      >{new Date(eventCalendar).toLocaleDateString()}</span
    >
    <p class="text-gray-400 pt-[1.5rem] pb-[2rem]">
      {truncate(eventCalendarExc, { length: 70 })}
    </p>
    <div class="__card-link w-full h-auto text-center pb-5">
      <a
        class="border-2 px-[2rem] md:px-[2rem] py-[10px] rounded-[14px] border-[#00d6a1] text-[#00d6a1] font-semibold"
        href="/event-calendar-detail?{new URLSearchParams({
          title: eventCalendarTitle,
          event: event,
        }).toString()}"
        use:link
      >
        Baca Selengkapnya
      </a>
    </div>
  </div>
</div>
