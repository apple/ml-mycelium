<script lang="ts">
  import { ArrowTopRightOnSquare } from '@steeze-ui/heroicons';
  import { Icon } from '@steeze-ui/svelte-icon';

  export let href: string;
</script>

<a {href} class="text-sm font-semibold leading-6 text-gray-900 hover:text-gray-600"
  ><div class="flex gap-1 items-center">
    <span><slot /></span><Icon
      src={ArrowTopRightOnSquare}
      theme="solid"
      class="text-gray-300 h-4 w-auto"
    />
  </div></a
>
