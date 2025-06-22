<script>
	export let cacheData = [];

	$: {
		console.log('Cache data received:', cacheData);
	}

	function formatHex(value) {
		return `0x${value.toString(16).padStart(2, '0').toUpperCase()}`;
	}

	function getLineStatus(line) {
		if (!line.valid) return 'invalid';
		if (line.dirty) return 'dirty';
		return 'clean';
	}

	function getStatusColor(status) {
		switch (status) {
			case 'invalid': return '#6b7280'; // gray
			case 'dirty': return '#ef4444';   // red - 메모리와 다름
			case 'clean': return '#10b981';   // green - 메모리와 동일
			default: return '#6b7280';
		}
	}

	function getStatusText(status) {
		switch (status) {
			case 'invalid': return '무효';
			case 'dirty': return '변경됨';
			case 'clean': return '동기화됨';
			default: return '알 수 없음';
		}
	}
</script>

<div class="cache-viewer">
	<div class="cache-header">
		<h3>💾 캐시 메모리</h3>
		<div class="cache-legend">
			<div class="legend-item">
				<div class="status-indicator" style="background-color: #10b981;"></div>
				<span>동기화됨 (Clean)</span>
			</div>
			<div class="legend-item">
				<div class="status-indicator" style="background-color: #ef4444;"></div>
				<span>변경됨 (Dirty)</span>
			</div>
			<div class="legend-item">
				<div class="status-indicator" style="background-color: #6b7280;"></div>
				<span>무효 (Invalid)</span>
			</div>
		</div>
	</div>
	
	<div class="cache-grid">
		{#each cacheData as line, i}
			{@const status = getLineStatus(line)}
			<div 
				class="cache-line" 
				style="border-left: 4px solid {getStatusColor(status)}"
				title="캐시 라인 {line.index}: {getStatusText(status)} | Tag: {line.tag}"
			>
				<div class="line-header">
					<span class="line-index">L{line.index}</span>
					<span class="line-tag">Tag: {line.tag}</span>
					<span class="line-status" style="color: {getStatusColor(status)}">
						{getStatusText(status)}
					</span>
				</div>
				
				<div class="line-data">
					{#each line.data as byte, j}
						<div 
							class="cache-byte"
							class:non-zero={byte !== 0}
							title="오프셋 {j}: {formatHex(byte)} ({byte})"
						>
							{formatHex(byte)}
						</div>
					{/each}
				</div>
				
				<div class="line-flags">
					<span class="flag" class:active={line.valid}>V</span>
					<span class="flag" class:active={line.dirty}>D</span>
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
	.cache-viewer {
		background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
		border-radius: 12px;
		padding: 20px;
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
		margin: 16px 0;
	}

	.cache-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 16px;
		flex-wrap: wrap;
		gap: 12px;
	}

	.cache-header h3 {
		margin: 0;
		color: #1f2937;
		font-size: 1.25rem;
		font-weight: 600;
	}

	.cache-legend {
		display: flex;
		gap: 16px;
		flex-wrap: wrap;
	}

	.legend-item {
		display: flex;
		align-items: center;
		gap: 6px;
		font-size: 0.875rem;
		color: #4b5563;
	}

	.status-indicator {
		width: 12px;
		height: 12px;
		border-radius: 50%;
	}

	.cache-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 12px;
		max-height: 400px;
		overflow-y: auto;
	}

	.cache-line {
		background: white;
		border-radius: 8px;
		padding: 12px;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
		transition: all 0.2s ease;
	}

	.cache-line:hover {
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
		transform: translateY(-1px);
	}

	.line-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 8px;
		font-size: 0.75rem;
		font-weight: 500;
	}

	.line-index {
		background: #3b82f6;
		color: white;
		padding: 2px 6px;
		border-radius: 4px;
		font-weight: 600;
	}

	.line-tag {
		color: #6b7280;
	}

	.line-status {
		font-weight: 600;
	}

	.line-data {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 4px;
		margin-bottom: 8px;
	}

	.cache-byte {
		background: #f1f5f9;
		padding: 6px 4px;
		border-radius: 4px;
		text-align: center;
		font-family: 'Courier New', monospace;
		font-size: 0.75rem;
		font-weight: 500;
		color: #64748b;
		transition: all 0.2s ease;
	}

	.cache-byte.non-zero {
		background: #dbeafe;
		color: #1d4ed8;
		font-weight: 600;
	}

	.cache-byte:hover {
		background: #e0e7ff;
		transform: scale(1.1);
	}

	.line-flags {
		display: flex;
		gap: 4px;
		justify-content: flex-end;
	}

	.flag {
		background: #e5e7eb;
		color: #9ca3af;
		padding: 2px 4px;
		border-radius: 3px;
		font-size: 0.625rem;
		font-weight: 600;
		transition: all 0.2s ease;
	}

	.flag.active {
		background: #3b82f6;
		color: white;
	}

	/* 반응형 디자인 */
	@media (max-width: 768px) {
		.cache-grid {
			grid-template-columns: 1fr;
		}
		
		.cache-header {
			flex-direction: column;
			align-items: flex-start;
		}
		
		.cache-legend {
			width: 100%;
			justify-content: space-between;
		}
	}
</style> 