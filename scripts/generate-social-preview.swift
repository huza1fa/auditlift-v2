// Run from the repository root on macOS: swift scripts/generate-social-preview.swift
import AppKit
import Foundation

let width = 1200
let height = 630
let bitmap = NSBitmapImageRep(
	bitmapDataPlanes: nil, pixelsWide: width, pixelsHigh: height,
	bitsPerSample: 8, samplesPerPixel: 4, hasAlpha: true,
	isPlanar: false, colorSpaceName: .deviceRGB, bytesPerRow: 0, bitsPerPixel: 0
)!
let context = NSGraphicsContext(bitmapImageRep: bitmap)!
NSGraphicsContext.saveGraphicsState()
NSGraphicsContext.current = context

let background = NSColor(red: 0.96, green: 0.97, blue: 0.95, alpha: 1)
let brand = NSColor(red: 0.31, green: 0.48, blue: 0.31, alpha: 1)
let foreground = NSColor(red: 0.10, green: 0.16, blue: 0.12, alpha: 1)
background.setFill()
NSRect(x: 0, y: 0, width: width, height: height).fill()
brand.setFill()
NSRect(x: 0, y: 0, width: 16, height: height).fill()

func text(_ value: String, x: CGFloat, y: CGFloat, width: CGFloat, height: CGFloat,
	size: CGFloat, weight: NSFont.Weight, color: NSColor) {
	let paragraph = NSMutableParagraphStyle()
	paragraph.lineSpacing = 5
	(value as NSString).draw(in: NSRect(x: x, y: y, width: width, height: height), withAttributes: [
		.font: NSFont.systemFont(ofSize: size, weight: weight),
		.foregroundColor: color,
		.paragraphStyle: paragraph
	])
}

text("AuditLift", x: 80, y: 495, width: 1000, height: 65, size: 38, weight: .semibold, color: brand)
text("Security questionnaires.\nSource-backed answers.", x: 80, y: 260, width: 1050, height: 195,
	size: 62, weight: .bold, color: foreground)
text("AI-assisted responses for B2B SaaS teams", x: 82, y: 175, width: 1000, height: 55,
	size: 29, weight: .regular, color: foreground)
text("Cited answers  ·  Approved knowledge  ·  Clear gaps", x: 82, y: 77, width: 1000, height: 45,
	size: 24, weight: .medium, color: brand)
NSGraphicsContext.restoreGraphicsState()

let png = bitmap.representation(using: .png, properties: [:])!
try png.write(to: URL(fileURLWithPath: "static/og.png"))
