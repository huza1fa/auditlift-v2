export interface ReviewableCitation {
	sourceType: string;
	sourceId: string;
	sourceTitle: string;
	excerpt: string;
}

export interface CurrentAnswerSource {
	available: boolean;
	currentText: string;
}
