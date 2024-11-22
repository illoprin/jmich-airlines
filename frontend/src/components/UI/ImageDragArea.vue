<script>
import { SERVER_URL } from '@/utils/config';
import { axios_post_proxy, get_decode_token } from '@/http';
import { user_upload_avatar } from '@/http/userAPI';
import { redirect } from '@/utils/tools';


export default {
	data() {
		return {
			dragover: false,
			uploaded_image: undefined,
		}
	},
	props: {
		img_src: {
			type: String,
			required: true,
		},
		circle: {
			type: Boolean,
			required: false,
			default: false
		},
		img_width: {
			type: Number,
			required: false,
			default: 100,
		},
		upload_url: {
			type: String,
			default: (SERVER_URL + '/upload-image'),
		},
		redirect_url: {
			type: String,
			default: '/'
		}
	},
	methods: {
		img_dragover (e) {
			this.dragover = true;
			console.log('Dragover');
		},
		img_dragleave(e) {
			this.dragover = false;
			console.log('Dragleave');
		},
		img_dragend(e) {
			this.dragover = false;
			console.log('Dragend');
		},
		async img_drop(e) {
			console.log('DROP!');
			const drop_result = this.on_file_select(e);
			if (drop_result) {
				await this.upload_file();
			}
			this.dropover = false;
		},

		async upload_file () {
			const form_data = new FormData();
			form_data.append('image', this.uploaded_image);
			console.log ('POST DATA ', form_data);
			const token = localStorage.getItem('token');
			const post_avatar = await axios_post_proxy(this, this.upload_url, token, form_data);
			redirect(this.redirect_url);
		},

		on_file_select (e) {
			const files = e.target.files;
			if (files.length > 0) {
				// Handle file input
				const file = files[0];
				if (file.type.split('/')[0] == 'image') {
					this.uploaded_image = file;
					this.dragover = false;
					console.log(file);
					return true;
				} else {
					// File is not image
					// Handle toast error
					return false;
				}
			}
		}
	}
}
</script>

<template>
	<div 
		class="w-100 position-relative drag-area" 
		:class="{'dragover' : dragover}" 
		@dragover.prevent="e => img_dragover(e)"
		@dragleave.prevent="e => img_dragleave(e)"
		@dragend.prevent="e => img_dragend(e)"
	>
		<input 
			type="file" 
			class="position-absolute w-50 h-100 drag-input"
			tabindex="1"
			@change="img_drop"
		>
		<img 
			:src="img_src"
			class="object-fit-cover"
			:class="{'rounded-circle' : circle}" 
			:width="img_width" 
			:height="img_width"
			alt="Image Drag Area" 
		>
	</div>
</template>

<style scoped>
.drag-input {
	opacity:0
}
.drag-input:hover {
	cursor: pointer;
	
}
.drag-area {
	transition: transform 300ms;
}
.drag-area.dragover {
	background: rgba(255, 255, 255, .3);
	transform: scale(1.1);
}
.drag-area:active {
	transform: scale(1.03);
}
</style>