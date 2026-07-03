// readingcore-01-keepout.scad
// IDB-6C CAD Export Demo Pack
// ReadingCore-01 固定灯芯模块占位/隔离几何
// 说明：该文件定义了 ReadingCore-01 在物理空间中不可被外壳侵犯的区域。
//       任何外壳设计必须保证该 keepout 体积完整，并在外侧预留装配余量。
//       所有尺寸均为示意值（mock geometry），需用真实工程尺寸替换。

// 是否只显示线框（便于叠加查看）
show_wireframe = false;

// ReadingCore-01 核心尺寸（示意）
core_length = 320;      // 铝槽+LED 总长，单位 mm
core_width  =  24;      // 铝槽宽度
core_height =  12;      // 铝槽+LED 高度（不含扩散罩）
diffuser_height = 4;    // 乳白扩散罩额外高度

// 安装接口
mount_hole_diameter = 3.2;  // M3 螺丝通孔直径
mount_hole_spacing  = 300;  // 两端安装孔中心距
base_offset_z = -20;        // 底座/支架在铝槽下方的占位

// 总 keepout 尺寸
total_width  = core_width + 2 * 0.5;   // 两侧各留 0.5mm 间隙
total_height = core_height + diffuser_height + 0.5;
total_length = core_length + 2 * 0.5;

module readingcore_keepout() {
    color("DarkOrange", 0.35) {
        // 主散热铝槽 + LED + 扩散罩占位
        translate([0, 0, core_height/2 + diffuser_height/2])
            cube([total_length, total_width, total_height], center=true);

        // 底座/支架占位（示意，避免外壳压迫支架）
        translate([0, 0, base_offset_z/2])
            cube([core_length * 0.6, core_width * 1.5, abs(base_offset_z)], center=true);
    }

    if (show_wireframe) {
        %translate([0, 0, core_height/2 + diffuser_height/2])
            cube([total_length, total_width, total_height], center=true);
    }
}

// 扩散罩槽（外壳内壁应避让的槽）
module diffuser_slot() {
    color("LightBlue", 0.3)
        translate([0, 0, core_height/2 + diffuser_height/2])
            cube([total_length + 4, total_width + 2, diffuser_height + 0.5], center=true);
}

// M3 安装孔标记（表示不可遮挡）
module m3_mount_holes() {
    for (x = [-mount_hole_spacing/2, mount_hole_spacing/2]) {
        translate([x, 0, core_height + diffuser_height + 2])
            color("Red", 0.6)
                cylinder(h = 10, d = mount_hole_diameter, $fn = 24, center = true);
    }
}

// 线缆出口（外壳需为电源线留出的孔）
module cable_exit() {
    color("Yellow", 0.5)
        translate([core_length/2 + 8, 0, core_height/2])
            cylinder(h = 12, d = 8, $fn = 24, center = true);
}

// 装配原点标记
module origin_marker() {
    color("Black") {
        translate([0, 0, -30]) cylinder(h=2, d=2, $fn=12);
    }
}

readingcore_keepout();
diffuser_slot();
m3_mount_holes();
cable_exit();
origin_marker();

// 可选：导出时仅使用 keepout 主体即可
// 使用示例：
//   openscad -o readingcore-01-keepout.stl readingcore-01-keepout.scad
