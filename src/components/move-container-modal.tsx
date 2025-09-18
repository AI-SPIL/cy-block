import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { api } from "@/lib/axios";
import type { Slot } from "@/types/main";

// Define the actual API response structure for available slots
interface DepoDetailWithAvailableSlots {
	available_slots: Slot[];
}
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface ProcessedSlot {
	block: string;
	row: number;
	column: number;
	tier: number;
	position: string;
	available: boolean;
}

export interface MoveContainerModalProps {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	selectedContainer: {
		id: string;
		containerCode: string;
		blockName: string;
		row: number;
		column: number;
		tier: number;
	} | null;
	availableSlots?: DepoDetailWithAvailableSlots;
	onMoveComplete: () => void;
}

export function MoveContainerModal({ isOpen, onOpenChange, selectedContainer, availableSlots: propAvailableSlots, onMoveComplete }: MoveContainerModalProps) {
	// Component for moving containers with enhanced interface
	const [availableSlots, setAvailableSlots] = useState<ProcessedSlot[]>([]);
	const [selectedSlot, setSelectedSlot] = useState<ProcessedSlot | null>(null);
	const [selectedTier, setSelectedTier] = useState<number>(1);
	const [loading, setLoading] = useState(false);

	// Process available slots from props
	const processAvailableSlots = (apiSlots: Slot[]) => {
		if (!Array.isArray(apiSlots)) {
			setAvailableSlots([]);
			return;
		}
		
		const slots: ProcessedSlot[] = apiSlots.map((s) => {
			// Add validation for required fields
			if (!s.block || s.row === undefined || s.column === undefined || s.tier === undefined) {
				return null;
			}
			
			return {
				block: s.block,
				row: Number(s.row),
				column: Number(s.column),
				tier: Number(s.tier),
				position: `${s.block}.${s.row}.${s.column}.${s.tier}`,
				available: true,
			};
		}).filter(Boolean) as ProcessedSlot[]; // Remove null entries
		
		setAvailableSlots(slots);
	};

	// Handle slot selection
	const handleSlotSelect = (slot: ProcessedSlot) => {
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
			// Use the new API endpoint for moving containers
			await api.post(`/shifting-log/container/${selectedContainer.id}`, {
				block: selectedSlot.block,
				row: selectedSlot.row,
				column: selectedSlot.column,
				tier: selectedTier,
			});

			toast.success("Container moved successfully!");

			// Reset selection but keep modal open for potential next move
			setSelectedSlot(null);
			setSelectedTier(1);

			onMoveComplete();
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
	}, {} as Record<string, Record<number, Record<number, ProcessedSlot[]>>>);

	// Handle modal open
	const handleOpenChange = (open: boolean) => {
		if (open && selectedContainer) {
			// Check if we have available slots data
			if (propAvailableSlots?.available_slots && Array.isArray(propAvailableSlots.available_slots)) {
				processAvailableSlots(propAvailableSlots.available_slots);
			} else if (Array.isArray(propAvailableSlots)) {
				// Fallback: if propAvailableSlots is directly an array
				processAvailableSlots(propAvailableSlots);
			} else {
				setAvailableSlots([]);
			}
		} else {
			setSelectedSlot(null);
			setSelectedTier(1);
			setAvailableSlots([]);
		}
		onOpenChange(open);
	};

	// Process available slots when component mounts or when propAvailableSlots changes
	useEffect(() => {
		if (propAvailableSlots?.available_slots && Array.isArray(propAvailableSlots.available_slots)) {
			processAvailableSlots(propAvailableSlots.available_slots);
		}
	}, [propAvailableSlots]);

	return (
		<Dialog open={isOpen} onOpenChange={handleOpenChange}>
			<DialogContent className="max-w-[96vw] w-[96vw] h-[92vh] max-h-[92vh] top-[4%] p-2 z-[99999]">
				<DialogHeader className="pb-1">
					<DialogTitle className="text-sm font-medium">
						Move Container:{" "}
						{selectedContainer && (
							<>
								<span className="text-blue-700">{selectedContainer.containerCode}</span> from{" "}
								<span className="text-gray-700">
									{selectedContainer.blockName}.{selectedContainer.row}.{selectedContainer.column}.{selectedContainer.tier}
								</span>
							</>
						)}
					</DialogTitle>
				</DialogHeader>

				{availableSlots.length > 0 ? (
					<div className="flex flex-col h-full space-y-2">
						{/* Slot Selection Grid - Full Screen Layout */}
						<div className="flex-1 min-h-0">
							<h3 className="text-xs font-medium mb-1 text-gray-600">Select Position (Block.Row.Column)</h3>
							<div className="h-full border border-gray-200 rounded-lg p-1 bg-gradient-to-b from-gray-50 to-white">
								{/* Block Headers and Grids - Side by Side */}
								<div className="flex gap-2 h-full">
									{Object.keys(slotsByBlock)
										.sort()
										.map((block) => (
											<div key={block} className="flex-1 flex flex-col">
												<div className="text-center mb-1">
													<h4 className="font-semibold text-xs text-white bg-gradient-to-r from-blue-600 to-blue-700 py-1 px-3 rounded-md shadow-sm">BLOCK {block}</h4>
												</div>

												{/* Grid for this block - Larger slots */}
												<div className="flex-1 overflow-hidden bg-white rounded border border-gray-100 p-1">
													{(() => {
														const maxRows = Math.max(...Object.keys(slotsByBlock[block] || {}).map(Number));
														const maxColumns = Math.max(...Object.values(slotsByBlock[block] || {}).flatMap((row) => Object.keys(row).map(Number)));

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
																					const availableSlot = slots && slots.find((s) => s.available);
																					const isCurrentPosition =
																						selectedContainer &&
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
																							${
																								isCurrentPosition
																									? "border-purple-500 bg-purple-100 text-purple-800 border animate-pulse"
																									: selectedSlot?.block === block &&
																									  selectedSlot?.row === rowNumber &&
																									  selectedSlot?.column === columnNumber
																									? "border-amber-400 bg-amber-100 text-amber-800 border"
																									: availableSlot
																									? "border-emerald-400 bg-emerald-50 hover:bg-emerald-100 cursor-pointer text-emerald-700 hover:shadow-sm"
																									: slots
																									? "border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed"
																									: "border-gray-200 bg-gray-50 text-gray-300"
																							}
																						`}
																							title={`Block ${block}, Row ${rowNumber}, Column ${columnNumber} - ${
																								availableSlot ? "Available" : slots ? "Occupied" : "Empty"
																							}`}
																						>
																							{rowNumber}_{columnNumber}
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
												(s) => s.block === selectedSlot.block && s.row === selectedSlot.row && s.column === selectedSlot.column && s.tier === tier
											);

											return (
												<button
													key={tier}
													onClick={() => handleTierSelect(tier)}
													disabled={!tierSlot?.available}
													className={`
														w-9 h-8 rounded border-2 font-medium transition-all text-xs
														${
															selectedTier === tier
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
										<div className="w-3 h-2 bg-purple-100 border border-purple-500 rounded ring-2 ring-purple-400"></div>
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
												<span className="text-gray-600">From:</span>{" "}
												<span className="font-medium">
													{selectedContainer?.blockName}.{selectedContainer?.row}.{selectedContainer?.column}.{selectedContainer?.tier}
												</span>
											</div>
											<div>
												<span className="text-gray-600">To:</span>{" "}
												<span className="font-medium">
													{selectedSlot.block}.{selectedSlot.row}.{selectedSlot.column}.{selectedTier}
												</span>
											</div>
										</div>
									</div>
									<div className="flex gap-1.5">
										<Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1 h-7 text-xs border-gray-300 hover:bg-gray-50">
											Cancel
										</Button>
										<Button onClick={handleMoveContainer} disabled={loading} className="flex-1 h-7 text-xs bg-blue-600 hover:bg-blue-700 shadow-sm">
											{loading ? "Moving..." : "Move"}
										</Button>
									</div>
								</div>
							)}
						</div>
					</div>
				) : (
					<div className="text-center py-12 rounded-lg">
						<div className="text-neutral-700 mb-4 text-xl">No slots available to display.</div>
					</div>
				)}
			</DialogContent>
		</Dialog>
	);
}
