import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { api } from "@/lib/axios";
import type { ContainerDataResponse } from "@/types/api";
import { useState } from "react";
import { toast } from "sonner";

interface AvailableSlot {
	block: string;
	row: number;
	column: number;
	tier: number;
	position: string;
	available: boolean;
}

interface MoveContainerModalProps {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	selectedContainer: {
		containerCode: string;
		blockName: string;
		row: number;
		column: number;
		tier: number;
	} | null;
	depoName: string;
	onMoveComplete: () => void;
}

export function MoveContainerModal({
	isOpen,
	onOpenChange,
	selectedContainer,
	depoName,
	onMoveComplete,
}: MoveContainerModalProps) {
	const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([]);
	const [selectedSlot, setSelectedSlot] = useState<AvailableSlot | null>(null);
	const [selectedTier, setSelectedTier] = useState<number>(1);
	const [loading, setLoading] = useState(false);
	const [loadingSlots, setLoadingSlots] = useState(false);

	// Fetch available slots when modal opens
	const fetchAvailableSlots = async () => {
		if (!selectedContainer) return;

		setLoadingSlots(true);
		try {
			console.log("Fetching data for:", depoName);
			console.log("API Base URL:", import.meta.env.VITE_API_URL);
			const response = await api.get(`/get-dummy?cy=${depoName}&user=yon`);
			console.log("API Response:", response);
			
			// The response structure might be different
			const data: ContainerDataResponse[] = response.data || response;
			console.log("Container data:", data);

			if (!data || !Array.isArray(data) || data.length === 0) {
				console.warn("No valid data received from API, using mock data");
				// Create mock data for testing
				const mockData: ContainerDataResponse[] = [
					// Block A - Sample containers
					{
						Block: "A",
						Row: 1,
						Column: 1, 
						Tier: 1,
						Container: "MOCK1234567",
						STATE: "FTL",
						"CONTAINER GRADE": "A",
						TYPE: "20 Container",
						LOGISTIC: "Test",
						OWNER: "Test",
						"TGL FXD": "2024-01-01",
						"TGL. STATUS": "2024-01-01",
						"VESSEL TERAKHIR": "Test"
					},
					{
						Block: "A", 
						Row: 1,
						Column: 3,
						Tier: 1, 
						Container: "MOCK2345678",
						STATE: "MTD",
						"CONTAINER GRADE": "B",
						TYPE: "20 Container",
						LOGISTIC: "Test",
						OWNER: "Test", 
						"TGL FXD": "2024-01-01",
						"TGL. STATUS": "2024-01-01",
						"VESSEL TERAKHIR": "Test"
					},
					{
						Block: "A", 
						Row: 2,
						Column: 2,
						Tier: 1, 
						Container: "MOCK3456789",
						STATE: "MTA",
						"CONTAINER GRADE": "A",
						TYPE: "20 Container",
						LOGISTIC: "Test",
						OWNER: "Test", 
						"TGL FXD": "2024-01-01",
						"TGL. STATUS": "2024-01-01",
						"VESSEL TERAKHIR": "Test"
					},
					// Block B - Sample containers
					{
						Block: "B", 
						Row: 1,
						Column: 2,
						Tier: 1, 
						Container: "MOCK4567890",
						STATE: "FTL",
						"CONTAINER GRADE": "C",
						TYPE: "20 Container",
						LOGISTIC: "Test",
						OWNER: "Test", 
						"TGL FXD": "2024-01-01",
						"TGL. STATUS": "2024-01-01",
						"VESSEL TERAKHIR": "Test"
					},
					{
						Block: "B", 
						Row: 3,
						Column: 1,
						Tier: 2,
						Container: "MOCK5678901",
						STATE: "STR",
						"CONTAINER GRADE": "B",
						TYPE: "20 Container",
						LOGISTIC: "Test",
						OWNER: "Test", 
						"TGL FXD": "2024-01-01",
						"TGL. STATUS": "2024-01-01",
						"VESSEL TERAKHIR": "Test"
					},
					// Block C - Sample containers
					{
						Block: "C", 
						Row: 1,
						Column: 1,
						Tier: 1, 
						Container: "MOCK6789012",
						STATE: "MTB",
						"CONTAINER GRADE": "A",
						TYPE: "20 Container",
						LOGISTIC: "Test",
						OWNER: "Test", 
						"TGL FXD": "2024-01-01",
						"TGL. STATUS": "2024-01-01",
						"VESSEL TERAKHIR": "Test"
					},
					{
						Block: "C", 
						Row: 2,
						Column: 3,
						Tier: 1, 
						Container: "MOCK7890123",
						STATE: "MTS",
						"CONTAINER GRADE": "C",
						TYPE: "20 Container",
						LOGISTIC: "Test",
						OWNER: "Test", 
						"TGL FXD": "2024-01-01",
						"TGL. STATUS": "2024-01-01",
						"VESSEL TERAKHIR": "Test"
					}
				];
				
				// Use mock data for grid generation
				const occupiedSlots = new Set();
				mockData.forEach((container: ContainerDataResponse) => {
					const slotKey = `${container.Block}-${container.Row}-${container.Column}-${container.Tier}`;
					occupiedSlots.add(slotKey);
				});

				const slots: AvailableSlot[] = [];
				const blocks = ["A", "B", "C"];
				const maxRow = 14; // Realistic row count up to 14 like in image
				const maxColumn = 7; // Realistic column count up to 7 like in image
				const maxTier = depoName === "YON" ? 6 : 4; // YON depot supports up to 6 tiers

				blocks.forEach((block) => {
					for (let row = 1; row <= maxRow; row++) {
						for (let column = 1; column <= maxColumn; column++) {
							for (let tier = 1; tier <= maxTier; tier++) {
								const slotKey = `${block}-${row}-${column}-${tier}`;
								const currentContainerSlot = `${selectedContainer.blockName}-${selectedContainer.row}-${selectedContainer.column}-${selectedContainer.tier}`;
								
								slots.push({
									block: block as string,
									row,
									column, 
									tier,
									position: `${block}.${row}.${column}.${tier}`,
									available: !occupiedSlots.has(slotKey) || slotKey === currentContainerSlot,
								});
							}
						}
					}
				});

				console.log("Using mock data, generated slots:", slots.length);
				setAvailableSlots(slots);
				return;
			}

			// Generate available slots based on existing containers
			const occupiedSlots = new Set();
			data.forEach((container: ContainerDataResponse) => {
				const slotKey = `${container.Block}-${container.Row}-${container.Column}-${container.Tier}`;
				occupiedSlots.add(slotKey);
			});

			console.log("Occupied slots:", occupiedSlots);

			// Create grid of available slots (simplified for demo)
			const slots: AvailableSlot[] = [];
			
			// Get unique blocks, rows, and columns from data
			const blocks = [...new Set(data.map((c: ContainerDataResponse) => c.Block))].sort();
			const maxRow = Math.max(...data.map((c: ContainerDataResponse) => +c.Row));
			const maxColumn = Math.max(...data.map((c: ContainerDataResponse) => +c.Column));
			const maxTier = depoName === "YON" ? 6 : 4; // YON depot supports up to 6 tiers

			console.log("Grid info:", { blocks, maxRow, maxColumn, maxTier });

			blocks.forEach((block) => {
				for (let row = 1; row <= maxRow; row++) {
					for (let column = 1; column <= maxColumn; column++) {
						for (let tier = 1; tier <= maxTier; tier++) {
							const slotKey = `${block}-${row}-${column}-${tier}`;
							const currentContainerSlot = `${selectedContainer.blockName}-${selectedContainer.row}-${selectedContainer.column}-${selectedContainer.tier}`;
							
							slots.push({
								block: block as string,
								row,
								column,
								tier,
								position: `${block}.${row}.${column}.${tier}`,
								available: !occupiedSlots.has(slotKey) || slotKey === currentContainerSlot,
							});
						}
					}
				}
			});

			console.log("Generated slots:", slots.length);
			console.log("Available slots:", slots.filter(s => s.available).length);
			setAvailableSlots(slots);
		} catch (error) {
			console.error("Error fetching available slots:", error);
			toast.error("Failed to load available slots");
		} finally {
			setLoadingSlots(false);
		}
	};

	// Handle slot selection
	const handleSlotSelect = (slot: AvailableSlot) => {
		if (!slot.available) return;
		setSelectedSlot(slot);
		setSelectedTier(slot.tier);
	};

	// Handle tier selection
	const handleTierSelect = (tier: number) => {
		if (!selectedSlot) return;
		setSelectedTier(tier);
	};

	// Handle move container
	const handleMoveContainer = async () => {
		if (!selectedContainer || !selectedSlot) return;

		setLoading(true);
		try {
			const newPosition = `${selectedSlot.block}.${selectedSlot.row}.${selectedSlot.column}.${selectedTier}`;
			
			await api.post("/update-dummy", {
				cy: depoName,
				nc: selectedContainer.containerCode,
				blockbaru: newPosition,
			});

			toast.success("Container moved successfully!");
			onMoveComplete();
			onOpenChange(false);
		} catch (error) {
			console.error("Error moving container:", error);
			toast.error("Failed to move container");
		} finally {
			setLoading(false);
		}
	};

	// Group slots by block for better visualization
	const slotsByBlock = availableSlots.reduce((acc, slot) => {
		if (!acc[slot.block]) acc[slot.block] = {};
		if (!acc[slot.block][slot.row]) acc[slot.block][slot.row] = {};
		if (!acc[slot.block][slot.row][slot.column]) acc[slot.block][slot.row][slot.column] = [];
		acc[slot.block][slot.row][slot.column].push(slot);
		return acc;
	}, {} as Record<string, Record<number, Record<number, AvailableSlot[]>>>);

	// Handle modal open
	const handleOpenChange = (open: boolean) => {
		if (open && selectedContainer) {
			fetchAvailableSlots();
		} else {
			setSelectedSlot(null);
			setSelectedTier(1);
			setAvailableSlots([]);
		}
		onOpenChange(open);
	};

	return (
		<Dialog open={isOpen} onOpenChange={handleOpenChange}>
			<DialogContent className="max-w-[96vw] w-[96vw] h-[92vh] max-h-[92vh] top-[4%] p-2 z-[99999]">
				<DialogHeader className="pb-1">
					<DialogTitle className="text-sm font-medium">
						Move Container: {selectedContainer && (
							<>
								<span className="text-blue-700">{selectedContainer.containerCode}</span> from{" "}
								<span className="text-gray-700">
									{selectedContainer.blockName}.{selectedContainer.row}.{selectedContainer.column}.{selectedContainer.tier}
								</span>
							</>
						)}
					</DialogTitle>
				</DialogHeader>

				{loadingSlots ? (
					<div className="flex items-center justify-center py-8">
						<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
						<span className="ml-2 text-sm text-gray-600">Loading slots...</span>
					</div>
				) : (
					<div className="flex flex-col h-full space-y-2">
						{/* Slot Selection Grid - Full Screen Layout */}
						{availableSlots.length > 0 ? (
							<div className="flex-1 min-h-0">
								<h3 className="text-xs font-medium mb-1 text-gray-600">Select Position (Block.Row.Column)</h3>
								<div className="h-full border border-gray-200 rounded-lg p-1 bg-gradient-to-b from-gray-50 to-white">
									{/* Block Headers and Grids - Side by Side */}
									<div className="flex gap-2 h-full">
										{Object.keys(slotsByBlock).sort().map((block) => (
											<div key={block} className="flex-1 flex flex-col">
												<div className="text-center mb-1">
													<h4 className="font-semibold text-xs text-white bg-gradient-to-r from-blue-600 to-blue-700 py-1 px-3 rounded-md shadow-sm">
														BLOCK {block}
													</h4>
												</div>

												{/* Grid for this block - Larger slots */}
												<div className="flex-1 overflow-hidden bg-white rounded border border-gray-100 p-1">
													{(() => {
														const maxRows = Math.max(
															...Object.keys(slotsByBlock[block] || {}).map(Number)
														);
														const maxColumns = Math.max(
															...Object.values(slotsByBlock[block] || {}).flatMap(row => 
																Object.keys(row).map(Number)
															)
														);
														
														// Create columns from 1 to maxColumns (show ALL columns)
														return (
															<div className="grid gap-1 h-full" style={{ gridTemplateRows: `repeat(${maxColumns}, minmax(0, 1fr))` }}>
																{Array.from({ length: maxColumns }, (_, colIndex) => {
																	const columnNumber = colIndex + 1;
																	
																	return (
																		<div key={columnNumber} className="flex gap-1 items-center">
																			{/* COLUMN label - Compact */}
																			<div className="w-8 h-5 flex items-center justify-center text-xs font-medium text-gray-500 bg-gray-100 rounded border">
																				C{columnNumber}
																			</div>
																			
																			{/* Rows for this column (from maxRows down to 1) - Show ALL rows */}
																			<div className="flex gap-1 flex-1 overflow-x-auto">
																				{Array.from({ length: maxRows }, (_, rowIndex) => {
																					const rowNumber = maxRows - rowIndex; // Start from top row (reverse order)
																					const rowData = slotsByBlock[block][rowNumber];
																					const slots = rowData && rowData[columnNumber] ? rowData[columnNumber] : null;
																					const availableSlot = slots && slots.find(s => s.available);
																					const isCurrentPosition = selectedContainer && 
																						selectedContainer.blockName === block &&
																						selectedContainer.row === rowNumber &&
																						selectedContainer.column === columnNumber;
																					
																					return (
																						<button
																							key={`${block}-${rowNumber}-${columnNumber}`}
																							onClick={() => availableSlot && handleSlotSelect(availableSlot)}
																							disabled={!availableSlot}
																							className={`
																								flex-shrink-0 w-12 h-5 rounded border text-xs font-medium transition-all relative
																								${selectedSlot?.block === block && 
																									selectedSlot?.row === rowNumber && 
																									selectedSlot?.column === columnNumber
																									? "border-amber-400 bg-amber-100 text-amber-800 shadow ring-1 ring-amber-400"
																									: availableSlot
																									? "border-emerald-400 bg-emerald-50 hover:bg-emerald-100 cursor-pointer text-emerald-700 hover:shadow-sm"
																									: slots
																									? "border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed"
																									: "border-gray-200 bg-gray-50 text-gray-300"
																								}
																								${isCurrentPosition ? "ring-2 ring-red-400 ring-offset-1" : ""}
																							`}
																							title={`Block ${block}, Row ${rowNumber}, Column ${columnNumber} - ${availableSlot ? "Available" : slots ? "Occupied" : "Empty"}`}
																						>
																							{rowNumber}_{columnNumber}
																							{isCurrentPosition && (
																								<div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-red-500 rounded-full"></div>
																							)}
																						</button>
																					);
																				})}
																			</div>
																		</div>
																	);
																})}
															</div>
														);
													})()}
												</div>
											</div>
										))}
									</div>
								</div>
							</div>
						) : (
							<div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
								<div className="text-gray-500 mb-3 text-sm">No slots available to display</div>
								<button
									onClick={fetchAvailableSlots}
									className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
								>
									Retry Loading Slots
								</button>
							</div>
						)}

						{/* Bottom Section - Tier Selection and Actions */}
						<div className="flex gap-3 border-t border-gray-200 pt-2 bg-gray-50 rounded-lg p-2">
							{/* Tier Selection */}
							{selectedSlot && (
								<div className="flex-1">
									<h3 className="text-xs font-medium mb-1 text-gray-700">
										Tier for {selectedSlot.block}.{selectedSlot.row}.{selectedSlot.column}
									</h3>
									<div className="flex gap-1">
										{[1, 2, 3, 4, 5, 6].map((tier) => {
											const tierSlot = availableSlots.find(
												s => s.block === selectedSlot.block &&
													s.row === selectedSlot.row &&
													s.column === selectedSlot.column &&
													s.tier === tier
											);
											
											return (
												<button
													key={tier}
													onClick={() => handleTierSelect(tier)}
													disabled={!tierSlot?.available}
													className={`
														w-9 h-8 rounded border-2 font-medium transition-all text-xs
														${selectedTier === tier
															? "border-blue-500 bg-blue-100 text-blue-700 shadow"
															: tierSlot?.available
															? "border-gray-300 bg-white hover:border-emerald-400 hover:bg-emerald-50 cursor-pointer text-gray-700"
															: "border-red-200 bg-red-50 text-red-400 cursor-not-allowed"
														}
													`}
													title={`Tier ${tier} - ${tierSlot?.available ? "Available" : "Occupied"}`}
												>
													T{tier}
												</button>
											);
										})}
									</div>
								</div>
							)}

							{/* Legend */}
							<div className="flex-1">
								<h5 className="font-medium mb-1 text-gray-700 text-xs">Legend:</h5>
								<div className="grid grid-cols-2 gap-1 text-xs">
									<div className="flex items-center gap-1">
										<div className="w-3 h-2 bg-emerald-50 border border-emerald-400 rounded"></div>
										<span className="text-gray-600">Available</span>
									</div>
									<div className="flex items-center gap-1">
										<div className="w-3 h-2 bg-gray-100 border border-gray-300 rounded"></div>
										<span className="text-gray-600">Occupied</span>
									</div>
									<div className="flex items-center gap-1">
										<div className="w-3 h-2 bg-amber-100 border border-amber-400 rounded"></div>
										<span className="text-gray-600">Selected</span>
									</div>
									<div className="flex items-center gap-1">
										<div className="w-3 h-2 bg-emerald-50 border border-emerald-400 rounded ring-1 ring-red-400"></div>
										<span className="text-gray-600">Current</span>
									</div>
								</div>
							</div>

							{/* Actions */}
							{selectedSlot && (
								<div className="flex-1">
									<div className="bg-blue-50 border border-blue-200 p-2 rounded mb-1">
										<h4 className="font-medium text-blue-800 mb-0.5 text-xs">Move Summary</h4>
										<div className="text-xs space-y-0.5 text-blue-700">
											<div>
												<span className="text-gray-600">From:</span> <span className="font-medium">{selectedContainer?.blockName}.{selectedContainer?.row}.{selectedContainer?.column}.{selectedContainer?.tier}</span>
											</div>
											<div>
												<span className="text-gray-600">To:</span> <span className="font-medium">{selectedSlot.block}.{selectedSlot.row}.{selectedSlot.column}.{selectedTier}</span>
											</div>
										</div>
									</div>
									<div className="flex gap-1.5">
										<Button
											variant="outline"
											onClick={() => onOpenChange(false)}
											className="flex-1 h-7 text-xs border-gray-300 hover:bg-gray-50"
										>
											Cancel
										</Button>
										<Button
											onClick={handleMoveContainer}
											disabled={loading}
											className="flex-1 h-7 text-xs bg-blue-600 hover:bg-blue-700 shadow-sm"
										>
											{loading ? "Moving..." : "Move"}
										</Button>
									</div>
								</div>
							)}
						</div>
					</div>
				)}
			</DialogContent>
		</Dialog>
	);
}
