<script>

</script>

<template>
	<div class="row w-100 p-4">
		<div class="col-5">
			<h2 class="fw-bold">
				<slot name="left"></slot>
			</h2>
		</div>
		<div class="col-7 d-flex justify-content-end gap-2">
			<slot name="right"></slot>
		</div>
	</div>
</template>