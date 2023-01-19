/**  WORKSPACE TYPES */
export interface WorkspaceType {
	facebook_admin: string;
	linked_groups: GroupType[];
	linked_pages: PageType[];
	managers: string[];
	longLivedToken?: string; //sensible
}

// workspace user
export interface UserInWorkspace {
	workspace: string;
}

// Own group data type
export interface GroupType {
	name: string;
	id: string;
	administrator: string;
	picture: {
		data: {
			height: number;
			width: number;
			is_silhouette: boolean;
			url: string;
		};
	};
}

// External group data type
export interface ExternalGroupType {
	name: string;
	id: string;
	picture: {
		data: {
			height: number;
			width: number;
			is_silhouette: boolean;
			url: string;
		};
	};
}

// Page data type
export interface PageType {
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
