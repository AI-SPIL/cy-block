import type { ExampleResponse } from "./types";

export const mappingBayurData = {
  id: "4",
  depo_name: "mapping-bayur",
  depo_blocks: [
    {
      block_name: "A",
      block_slots: [
    { container_code: "TCLU1234567", column: 1, row: 1, tier: 1, size: "20", grade: "A", status: "MTD" },
    { container_code: "TCLU1234568", column: 2, row: 1, tier: 1, size: "20", grade: "B", status: "MTA" },
    { container_code: "TCLU1234570", column: 3, row: 1, tier: 1, size: "20", grade: "C", status: "MTS" },
    { container_code: "TCLU1234572", column: 3, row: 1, tier: 2, size: "20", grade: "A", status: "MTB" },
    { container_code: "TCLU1234573", column: 1, row: 2, tier: 1, size: "20", grade: "C", status: "FTL" },
    { container_code: "TCLU1234575", column: 2, row: 2, tier: 1, size: "20", grade: "B", status: "STR" },
    { container_code: "TCLU1234576", column: 3, row: 2, tier: 1, size: "20", grade: "A", status: "MTD" },
      ]
    },
    {
      block_name: "B",
      block_slots: [
        { container_code: "TCLU1234584", column: 1, row: 1, tier: 1, size: "20", grade: "A", status: "MTA" },
        { container_code: "TCLU1234585", column: 1, row: 1, tier: 2, size: "20", grade: "B", status: "MTS" },
        { container_code: "TCLU1234586", column: 2, row: 1, tier: 1, size: "20", grade: "C", status: "MTB" },
        { container_code: "TCLU1234587", column: 3, row: 1, tier: 1, size: "20", grade: "A", status: "FTL" },
        { container_code: "TCLU1234588", column: 1, row: 2, tier: 1, size: "20", grade: "B", status: "STR" },
        { container_code: "TCLU1234589", column: 1, row: 2, tier: 2, size: "20", grade: "C", status: "MTD" },
        { container_code: "TCLU1234590", column: 2, row: 2, tier: 1, size: "20", grade: "A", status: "MTA" },
        { container_code: "TCLU1234591", column: 3, row: 2, tier: 1, size: "20", grade: "B", status: "MTS" },
        { container_code: "TCLU1234592", column: 1, row: 3, tier: 1, size: "20", grade: "C", status: "MTB" },
        { container_code: "TCLU1234593", column: 1, row: 3, tier: 2, size: "20", grade: "A", status: "FTL" },
        { container_code: "TCLU1234594", column: 2, row: 3, tier: 1, size: "20", grade: "B", status: "STR" },
        { container_code: "TCLU1234595", column: 3, row: 3, tier: 1, size: "20", grade: "C", status: "MTD" },
        { container_code: "TCLU1234596", column: 3, row: 3, tier: 2, size: "20", grade: "A", status: "MTA" }
      ]
    },
    {
      block_name: "C",
      block_slots: [
        { container_code: "TCLU1234597", column: 1, row: 0, tier: 1, size: "20", grade: "A", status: "MTD" },
        { container_code: "TCLU1234598", column: 2, row: 0, tier: 1, size: "20", grade: "B", status: "MTA" },
        { container_code: "TCLU1234599", column: 3, row: 0, tier: 2, size: "20", grade: "C", status: "MTS" },
        { container_code: "TCLU1234600", column: 4, row: 0, tier: 1, size: "20", grade: "A", status: "MTB" },
        { container_code: "TCLU1234601", column: 5, row: 0, tier: 1, size: "20", grade: "B", status: "FTL" },
        { container_code: "TCLU1234602", column: 6, row: 0, tier: 1, size: "20", grade: "C", status: "STR" },
        { container_code: "TCLU1234603", column: 7, row: 0, tier: 2, size: "20", grade: "A", status: "MTD" },
        { container_code: "TCLU1234604", column: 8, row: 0, tier: 1, size: "20", grade: "B", status: "MTA" },
        { container_code: "TCLU1234605", column: 9, row: 0, tier: 1, size: "20", grade: "C", status: "MTS" },
        { container_code: "TCLU1234606", column: 10, row: 0, tier: 1, size: "20", grade: "A", status: "MTB" },
        { container_code: "TCLU1234607", column: 11, row: 0, tier: 1, size: "20", grade: "B", status: "FTL" }
      ]
    },
    {
      block_name: "D",
      block_slots: [
        { container_code: "TCLU1234597", column: 1, row: 0, tier: 1, size: "20", grade: "A", status: "STR" },
        { container_code: "TCLU1234598", column: 2, row: 0, tier: 1, size: "20", grade: "B", status: "MTD" },
        { container_code: "TCLU1234599", column: 3, row: 0, tier: 2, size: "20", grade: "C", status: "MTA" },
        { container_code: "TCLU1234600", column: 4, row: 0, tier: 1, size: "20", grade: "A", status: "MTS" },
        { container_code: "TCLU1234601", column: 5, row: 0, tier: 1, size: "20", grade: "B", status: "MTB" },
        { container_code: "TCLU1234602", column: 6, row: 0, tier: 1, size: "20", grade: "C", status: "FTL" },
        { container_code: "TCLU1234603", column: 7, row: 0, tier: 2, size: "20", grade: "A", status: "STR" },
        { container_code: "TCLU1234604", column: 8, row: 0, tier: 1, size: "20", grade: "B", status: "MTD" },
        { container_code: "TCLU1234605", column: 9, row: 0, tier: 1, size: "20", grade: "C", status: "MTA" },
        { container_code: "TCLU1234606", column: 10, row: 0, tier: 1, size: "20", grade: "A", status: "MTS" },
        { container_code: "TCLU1234607", column: 11, row: 0, tier: 1, size: "20", grade: "B", status: "MTB" }
      ]
    },
    {
      block_name: "E",
      block_slots: [
        { container_code: "TCLU1234597", column: 1, row: 0, tier: 1, size: "20", grade: "A", status: "FTL" },
        { container_code: "TCLU1234598", column: 2, row: 0, tier: 1, size: "20", grade: "B", status: "STR" },
        { container_code: "TCLU1234599", column: 3, row: 0, tier: 2, size: "20", grade: "C", status: "MTD" },
        { container_code: "TCLU1234600", column: 4, row: 0, tier: 1, size: "20", grade: "A", status: "MTA" },
        { container_code: "TCLU1234601", column: 5, row: 0, tier: 1, size: "20", grade: "B", status: "MTS" },
        { container_code: "TCLU1234602", column: 6, row: 0, tier: 1, size: "20", grade: "C", status: "MTB" },
        { container_code: "TCLU1234603", column: 7, row: 0, tier: 2, size: "20", grade: "A", status: "FTL" },
        { container_code: "TCLU1234604", column: 8, row: 0, tier: 1, size: "20", grade: "B", status: "STR" },
        { container_code: "TCLU1234605", column: 9, row: 0, tier: 1, size: "20", grade: "C", status: "MTD" },
        { container_code: "TCLU1234606", column: 10, row: 0, tier: 1, size: "20", grade: "A", status: "MTA" },
        { container_code: "TCLU1234607", column: 11, row: 0, tier: 1, size: "20", grade: "B", status: "MTS" }
      ]
    },
    {
      block_name: "F",
      block_slots: [
        { container_code: "TCLU1234597", column: 1, row: 0, tier: 1, size: "40", grade: "A", status: "MTB" },
        { container_code: "TCLU1234598", column: 2, row: 0, tier: 1, size: "40", grade: "B", status: "FTL" },
        { container_code: "TCLU1234599", column: 3, row: 0, tier: 2, size: "40", grade: "C", status: "STR" },
        { container_code: "TCLU1234600", column: 4, row: 0, tier: 1, size: "40", grade: "A", status: "MTD" },
      ]
    },
    {
      block_name: "G",
      block_slots: [
        { container_code: "TCLU1234597", column: 1, row: 0, tier: 1, size: "20", grade: "A", status: "MTA" },
        { container_code: "TCLU1234598", column: 2, row: 0, tier: 1, size: "20", grade: "B", status: "MTS" },
        { container_code: "TCLU1234599", column: 3, row: 0, tier: 2, size: "20", grade: "C", status: "MTB" },
        { container_code: "TCLU1234600", column: 4, row: 0, tier: 1, size: "20", grade: "A", status: "FTL" },
        { container_code: "TCLU1234601", column: 5, row: 0, tier: 1, size: "20", grade: "B", status: "STR" },
        { container_code: "TCLU1234602", column: 6, row: 0, tier: 1, size: "20", grade: "C", status: "MTD" },
        { container_code: "TCLU1234603", column: 7, row: 0, tier: 2, size: "20", grade: "A", status: "MTA" },
        { container_code: "TCLU1234604", column: 8, row: 0, tier: 1, size: "20", grade: "B", status: "MTS" },
        { container_code: "TCLU1234605", column: 9, row: 0, tier: 1, size: "20", grade: "C", status: "MTB" },
        { container_code: "TCLU1234606", column: 10, row: 0, tier: 1, size: "20", grade: "A", status: "FTL" },
        { container_code: "TCLU1234607", column: 11, row: 0, tier: 1, size: "20", grade: "B", status: "STR" }
      ]
    },
    {
      block_name: "H",
      block_slots: [
        { container_code: "TCLU1234597", column: 1, row: 0, tier: 1, size: "20", grade: "A", status: "MTD" },
        { container_code: "TCLU1234598", column: 2, row: 0, tier: 1, size: "20", grade: "B", status: "MTA" },
        { container_code: "TCLU1234599", column: 3, row: 0, tier: 2, size: "20", grade: "C", status: "MTS" },
        { container_code: "TCLU1234600", column: 4, row: 0, tier: 1, size: "20", grade: "A", status: "MTB" },
        { container_code: "TCLU1234601", column: 5, row: 0, tier: 1, size: "20", grade: "B", status: "FTL" },
        { container_code: "TCLU1234602", column: 6, row: 0, tier: 1, size: "20", grade: "C", status: "STR" },
        { container_code: "TCLU1234603", column: 7, row: 0, tier: 2, size: "20", grade: "A", status: "MTD" },
        { container_code: "TCLU1234604", column: 8, row: 0, tier: 1, size: "20", grade: "B", status: "MTA" },
        { container_code: "TCLU1234605", column: 9, row: 0, tier: 1, size: "20", grade: "C", status: "MTS" },
        { container_code: "TCLU1234606", column: 10, row: 0, tier: 1, size: "20", grade: "A", status: "MTB" },
        { container_code: "TCLU1234607", column: 11, row: 0, tier: 1, size: "20", grade: "B", status: "FTL" }
      ]
    },
    {
      block_name: "I",
      block_slots: [
        { container_code: "TCLU1234597", column: 1, row: 0, tier: 1, size: "20", grade: "A", status: "STR" },
        { container_code: "TCLU1234598", column: 2, row: 0, tier: 1, size: "20", grade: "B", status: "MTD" },
        { container_code: "TCLU1234599", column: 3, row: 0, tier: 2, size: "20", grade: "C", status: "MTA" },
        { container_code: "TCLU1234600", column: 4, row: 0, tier: 1, size: "20", grade: "A", status: "MTS" },
        { container_code: "TCLU1234601", column: 5, row: 0, tier: 1, size: "20", grade: "B", status: "MTB" },
        { container_code: "TCLU1234602", column: 6, row: 0, tier: 1, size: "20", grade: "C", status: "FTL" },
        { container_code: "TCLU1234603", column: 7, row: 0, tier: 2, size: "20", grade: "A", status: "STR" },
        { container_code: "TCLU1234604", column: 8, row: 0, tier: 1, size: "20", grade: "B", status: "MTD" },
        { container_code: "TCLU1234605", column: 9, row: 0, tier: 1, size: "20", grade: "C", status: "MTA" },
        { container_code: "TCLU1234606", column: 10, row: 0, tier: 1, size: "20", grade: "A", status: "MTS" },
        { container_code: "TCLU1234607", column: 11, row: 0, tier: 1, size: "20", grade: "B", status: "MTB" }
      ]
    },
    {
      block_name: "J",
      block_slots: [
        { container_code: "TCLU1234597", column: 1, row: 0, tier: 1, size: "20", grade: "A", status: "FTL" },
        { container_code: "TCLU1234598", column: 2, row: 0, tier: 1, size: "20", grade: "B", status: "STR" },
        { container_code: "TCLU1234599", column: 3, row: 0, tier: 2, size: "20", grade: "C", status: "MTD" },
        { container_code: "TCLU1234600", column: 4, row: 0, tier: 1, size: "20", grade: "A", status: "MTA" },
        { container_code: "TCLU1234601", column: 5, row: 0, tier: 1, size: "20", grade: "B", status: "MTS" },
        { container_code: "TCLU1234602", column: 6, row: 0, tier: 1, size: "20", grade: "C", status: "MTB" },
        { container_code: "TCLU1234603", column: 7, row: 0, tier: 2, size: "20", grade: "A", status: "FTL" },
        { container_code: "TCLU1234604", column: 8, row: 0, tier: 1, size: "20", grade: "B", status: "STR" },
        { container_code: "TCLU1234605", column: 9, row: 0, tier: 1, size: "20", grade: "C", status: "MTD" },
        { container_code: "TCLU1234606", column: 10, row: 0, tier: 1, size: "20", grade: "A", status: "MTA" },
        { container_code: "TCLU1234607", column: 11, row: 0, tier: 1, size: "20", grade: "B", status: "MTS" }
      ]
    },
    {
      block_name: "K",
      block_slots: [
        { container_code: "TCLU1234597", column: 1, row: 0, tier: 1, size: "40", grade: "A", status: "MTB" },
        // { container_code: "TCLU123459A", column: 1, row: 0, tier: 2, size: "40", grade: "A", status: "FTL" },
        { container_code: "TCLU1234598", column: 2, row: 0, tier: 1, size: "40", grade: "B", status: "STR" },
        { container_code: "TCLU1234599", column: 3, row: 0, tier: 2, size: "40", grade: "C", status: "MTD" },
        { container_code: "TCLU1234600", column: 4, row: 0, tier: 1, size: "40", grade: "A", status: "MTA" },
      ]
    },
    {
      block_name: "L",
      block_slots: [
        { container_code: "TCLU1234597", column: 1, row: 1, tier: 1, size: "20", grade: "A", status: "MTS" },
        { container_code: "TCLU1234598", column: 1, row: 2, tier: 1, size: "20", grade: "B", status: "MTB" },
        { container_code: "TCLU1234599", column: 2, row: 1, tier: 2, size: "20", grade: "C", status: "FTL" },
        { container_code: "TCLU1234600", column: 2, row: 2, tier: 1, size: "20", grade: "A", status: "STR" },
        { container_code: "TCLU1234601", column: 3, row: 1, tier: 1, size: "20", grade: "B", status: "MTD" },
        { container_code: "TCLU1234602", column: 3, row: 2, tier: 1, size: "20", grade: "C", status: "MTA" },
        { container_code: "TCLU1234603", column: 4, row: 1, tier: 2, size: "20", grade: "A", status: "MTS" },
        { container_code: "TCLU1234604", column: 4, row: 2, tier: 1, size: "20", grade: "B", status: "MTB" },
        { container_code: "TCLU1234605", column: 5, row: 1, tier: 1, size: "20", grade: "C", status: "FTL" },
        { container_code: "TCLU1234606", column: 5, row: 2, tier: 1, size: "20", grade: "A", status: "STR" },
        { container_code: "TCLU1234607", column: 6, row: 1, tier: 1, size: "20", grade: "B", status: "MTD" }
      ]
    },
    {
      block_name: "M",
      block_slots: [
        { container_code: "TCLU1234597", column: 1, row: 1, tier: 1, size: "20", grade: "A", status: "MTA" },
        { container_code: "TCLU1234598", column: 1, row: 2, tier: 1, size: "20", grade: "B", status: "MTS" },
        { container_code: "TCLU1234599", column: 2, row: 1, tier: 2, size: "20", grade: "C", status: "MTB" },
        { container_code: "TCLU1234600", column: 2, row: 2, tier: 1, size: "20", grade: "A", status: "FTL" },
        { container_code: "TCLU1234601", column: 3, row: 1, tier: 1, size: "20", grade: "B", status: "STR" },
        { container_code: "TCLU1234602", column: 3, row: 2, tier: 1, size: "20", grade: "C", status: "MTD" },
        { container_code: "TCLU1234603", column: 4, row: 1, tier: 2, size: "20", grade: "A", status: "MTA" },
        { container_code: "TCLU1234604", column: 4, row: 2, tier: 1, size: "20", grade: "B", status: "MTS" },
        { container_code: "TCLU1234605", column: 5, row: 1, tier: 1, size: "20", grade: "C", status: "MTB" },
        { container_code: "TCLU1234606", column: 5, row: 2, tier: 1, size: "20", grade: "A", status: "FTL" },
        { container_code: "TCLU1234607", column: 6, row: 1, tier: 1, size: "20", grade: "B", status: "STR" }
      ]
    },
    {
      block_name: "N",
      block_slots: [
        { container_code: "TCLU1234597", column: 1, row: 0, tier: 1, size: "20", grade: "A", status: "MTD" },
        { container_code: "TCLU1234598", column: 2, row: 0, tier: 1, size: "20", grade: "B", status: "MTA" },
        { container_code: "TCLU1234599", column: 3, row: 0, tier: 2, size: "20", grade: "C", status: "MTS" },
        { container_code: "TCLU1234600", column: 4, row: 0, tier: 1, size: "20", grade: "A", status: "MTB" },
        { container_code: "TCLU1234601", column: 5, row: 0, tier: 1, size: "20", grade: "B", status: "FTL" },
        { container_code: "TCLU1234602", column: 6, row: 0, tier: 1, size: "20", grade: "C", status: "STR" },
        { container_code: "TCLU1234603", column: 7, row: 0, tier: 2, size: "20", grade: "A", status: "MTD" },
        { container_code: "TCLU1234604", column: 8, row: 0, tier: 1, size: "20", grade: "B", status: "MTA" },
        { container_code: "TCLU1234605", column: 9, row: 0, tier: 1, size: "20", grade: "C", status: "MTS" },
        { container_code: "TCLU1234606", column: 10, row: 0, tier: 1, size: "20", grade: "A", status: "MTB" },
        { container_code: "TCLU1234607", column: 11, row: 0, tier: 1, size: "20", grade: "B", status: "FTL" }
      ]
    },
    {
      block_name: "O",
      block_slots: [
        { container_code: "TCLU1234597", column: 1, row: 0, tier: 1, size: "40", grade: "A", status: "STR" },
        { container_code: "TCLU1234598", column: 2, row: 0, tier: 1, size: "40", grade: "B", status: "MTD" },
        { container_code: "TCLU1234599", column: 3, row: 0, tier: 2, size: "40", grade: "C", status: "MTA" },
        { container_code: "TCLU1234600", column: 4, row: 0, tier: 1, size: "40", grade: "A", status: "MTS" },
        { container_code: "TCLU1234601", column: 5, row: 0, tier: 1, size: "40", grade: "B", status: "MTB" },
        { container_code: "TCLU1234602", column: 6, row: 0, tier: 1, size: "40", grade: "C", status: "FTL" },
        { container_code: "TCLU1234603", column: 7, row: 0, tier: 2, size: "40", grade: "A", status: "STR" },
        { container_code: "TCLU1234604", column: 8, row: 0, tier: 1, size: "40", grade: "B", status: "MTD" },
        { container_code: "TCLU1234605", column: 9, row: 0, tier: 1, size: "40", grade: "C", status: "MTA" },
        { container_code: "TCLU1234606", column: 10, row: 0, tier: 1, size: "40", grade: "A", status: "MTS" },
        { container_code: "TCLU1234607", column: 11, row: 0, tier: 1, size: "40", grade: "B", status: "MTB" }
      ]
    },
    {
      block_name: "P",
      block_slots: [
        { container_code: "TCLU1234597", column: 1, row: 0, tier: 1, size: "20", grade: "A", status: "FTL" },
        { container_code: "TCLU1234598", column: 2, row: 0, tier: 1, size: "20", grade: "B", status: "STR" },
        { container_code: "TCLU1234599", column: 3, row: 0, tier: 2, size: "20", grade: "C", status: "MTD" },
        { container_code: "TCLU1234600", column: 4, row: 0, tier: 1, size: "20", grade: "A", status: "MTA" },
        { container_code: "TCLU1234601", column: 5, row: 0, tier: 1, size: "20", grade: "B", status: "MTS" },
        { container_code: "TCLU1234602", column: 6, row: 0, tier: 1, size: "20", grade: "C", status: "MTB" },
      ]
    },
    {
      block_name: "Q",
      block_slots: [
        { container_code: "TCLU1234597", column: 1, row: 1, tier: 1, size: "40", grade: "A", status: "FTL" },
        { container_code: "TCLU1234598", column: 1, row: 2, tier: 1, size: "40", grade: "B", status: "STR" },
        { container_code: "TCLU1234599", column: 2, row: 1, tier: 1, size: "40", grade: "C", status: "MTD" },
        { container_code: "TCLU1234600", column: 2, row: 2, tier: 1, size: "40", grade: "A", status: "MTA" },
      ]
    },
    {
      block_name: "R",
      block_slots: [
        { container_code: "TCLU1234597", column: 1, row: 0, tier: 1, size: "40", grade: "A", status: "MTS" },
        { container_code: "TCLU1234598", column: 2, row: 0, tier: 1, size: "40", grade: "B", status: "MTB" },
        { container_code: "TCLU1234599", column: 3, row: 0, tier: 1, size: "40", grade: "C", status: "FTL" },
        { container_code: "TCLU1234600", column: 4, row: 0, tier: 1, size: "40", grade: "A", status: "STR" },
        { container_code: "TCLU1234601", column: 5, row: 0, tier: 1, size: "40", grade: "B", status: "MTD" },
        { container_code: "TCLU1234602", column: 6, row: 0, tier: 1, size: "40", grade: "C", status: "MTA" },
      ]
    },
    {
      block_name: "S",
      block_slots: [
        { container_code: "TCLU1234597", column: 1, row: 0, tier: 1, size: "40", grade: "A", status: "MTS" },
        { container_code: "TCLU1234598", column: 2, row: 0, tier: 1, size: "40", grade: "B", status: "MTB" },
        { container_code: "TCLU1234599", column: 3, row: 0, tier: 1, size: "40", grade: "C", status: "FTL" },
        { container_code: "TCLU1234600", column: 4, row: 0, tier: 1, size: "40", grade: "A", status: "STR" },
        { container_code: "TCLU1234601", column: 5, row: 0, tier: 1, size: "40", grade: "B", status: "MTD" },
        { container_code: "TCLU1234602", column: 6, row: 0, tier: 1, size: "40", grade: "C", status: "MTA" },
      ]
    },
    {
      block_name: "T",
      block_slots: [
        { container_code: "TCLU1234597", column: 1, row: 0, tier: 1, size: "40", grade: "A", status: "MTS" },
        { container_code: "TCLU1234598", column: 2, row: 0, tier: 1, size: "40", grade: "B", status: "MTB" },
        { container_code: "TCLU1234599", column: 3, row: 0, tier: 1, size: "40", grade: "C", status: "FTL" },
        { container_code: "TCLU1234600", column: 4, row: 0, tier: 1, size: "40", grade: "A", status: "STR" },
        { container_code: "TCLU1234601", column: 5, row: 0, tier: 1, size: "40", grade: "B", status: "MTD" },
        { container_code: "TCLU1234602", column: 6, row: 0, tier: 1, size: "40", grade: "C", status: "MTA" },
      ]
    },
    {
      block_name: "U",
      block_slots: [
        { container_code: "TCLU1234597", column: 1, row: 0, tier: 1, size: "20", grade: "A", status: "MTS" },
        { container_code: "TCLU1234598", column: 2, row: 0, tier: 1, size: "20", grade: "B", status: "MTB" },
        { container_code: "TCLU1234599", column: 3, row: 0, tier: 1, size: "20", grade: "C", status: "FTL" },
        { container_code: "TCLU1234600", column: 4, row: 0, tier: 1, size: "20", grade: "A", status: "STR" },
        { container_code: "TCLU1234601", column: 5, row: 0, tier: 1, size: "20", grade: "B", status: "MTD" },
        { container_code: "TCLU1234602", column: 6, row: 0, tier: 1, size: "20", grade: "C", status: "MTA" },
      ]
    },
    {
      block_name: "V",
      block_slots: [
        { container_code: "TCLU1234597", column: 1, row: 1, tier: 1, size: "40", grade: "A", status: "MTS" },
        { container_code: "TCLU1234598", column: 1, row: 2, tier: 1, size: "40", grade: "B", status: "MTB" },
        { container_code: "TCLU1234599", column: 2, row: 1, tier: 2, size: "40", grade: "C", status: "FTL" },
        { container_code: "TCLU1234600", column: 2, row: 2, tier: 1, size: "40", grade: "A", status: "STR" },
        { container_code: "TCLU1234601", column: 3, row: 1, tier: 1, size: "40", grade: "B", status: "MTD" },
        { container_code: "TCLU1234602", column: 3, row: 2, tier: 1, size: "40", grade: "C", status: "MTA" },
        { container_code: "TCLU1234603", column: 4, row: 1, tier: 2, size: "40", grade: "A", status: "MTS" },
        { container_code: "TCLU1234604", column: 4, row: 2, tier: 1, size: "40", grade: "B", status: "MTB" },
        { container_code: "TCLU1234605", column: 5, row: 1, tier: 1, size: "40", grade: "C", status: "FTL" },
        { container_code: "TCLU1234606", column: 5, row: 2, tier: 1, size: "40", grade: "A", status: "STR" },
        { container_code: "TCLU1234607", column: 6, row: 1, tier: 1, size: "40", grade: "B", status: "MTD" }
      ]
    },
    {
      block_name: "W",
      block_slots: [
        { container_code: "TCLU1234597", column: 1, row: 0, tier: 1, size: "20", grade: "A", status: "MTA" },
        { container_code: "TCLU1234598", column: 2, row: 0, tier: 1, size: "20", grade: "B", status: "MTS" },
        { container_code: "TCLU1234599", column: 3, row: 0, tier: 1, size: "20", grade: "C", status: "MTB" },
        { container_code: "TCLU1234600", column: 4, row: 0, tier: 1, size: "20", grade: "A", status: "FTL" },
        { container_code: "TCLU1234601", column: 5, row: 0, tier: 1, size: "20", grade: "B", status: "STR" },
        { container_code: "TCLU1234602", column: 6, row: 0, tier: 1, size: "20", grade: "C", status: "MTD" },
      ]
    },
    {
      block_name: "X",
      block_slots: [
        { container_code: "TCLU1234597", column: 1, row: 0, tier: 1, size: "40", grade: "A", status: "MTA" },
        { container_code: "TCLU1234598", column: 2, row: 0, tier: 1, size: "40", grade: "B", status: "MTS" },
        { container_code: "TCLU1234599", column: 3, row: 0, tier: 1, size: "40", grade: "C", status: "MTB" },
      ]
    },
  ]
} satisfies ExampleResponse;
