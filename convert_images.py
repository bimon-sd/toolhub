# Check if PowerPoint is available for COM automation
try:
    import win32com.client
    import os
    import pythoncom

    pythoncom.CoInitialize()

    ppt_path = os.path.abspath(
        "D:/线束业务培训/output/青岛弘博电缆_新业务入职培训.pptx"
    )
    output_dir = os.path.abspath("D:/线束业务培训/images")

    ppt_app = win32com.client.Dispatch("PowerPoint.Application")
    ppt_app.Visible = True

    ppt_presentation = ppt_app.Presentations.Open(ppt_path)

    # Export each slide as PNG
    for i, slide in enumerate(ppt_presentation.Slides):
        slide_name = f"slide-{i + 1:02d}.png"
        slide_path = os.path.join(output_dir, slide_name)
        slide.Export(slide_path, "PNG")
        print(f"Exported: {slide_name}")

    ppt_presentation.Close()
    ppt_app.Quit()

    pythoncom.CoUninitialize()
    print("Conversion completed!")

except Exception as e:
    print(f"Error: {e}")
    print("PowerPoint COM automation not available")
