/** WORKSPACE TYPES */

export interface FacebookPageResponseType {
	id: string;
	name: string;
	picture: {
		data: {
			height: number;
			width: number;
			is_silhouette: boolean;
			url: string;
		};
	};
}

export interface WorkspaceAdminPageData extends FacebookPageResponseType {
	page_long_lived_token: string;
}
