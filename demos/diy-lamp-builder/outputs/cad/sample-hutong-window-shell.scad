// sample-hutong-window-shell.scad
// IDB-6C CAD Export Demo Pack
// 胡同窗棂风格外壳示例（参数化）
// 说明：该文件演示如何围绕 ReadingCore-01 keepout 设计一个可定制外壳。
//       所有尺寸为示意值，可在外部通过 sample-config.json 覆盖关键参数。

// 默认参数（可在命令行用 -D 覆盖，例如 -D shell_length=300）
shell_length = 340;    // 外壳总长
shell_width  =  40;    // 外壳总宽
shell_height =  35;    // 外壳总高（含屋檐）
wall_thickness = 2.5;  // 外壳壁厚
window_count = 5;      // 窗棂格栅数量
cutout_ratio = 0.55;   // 格栅开口比例（0~1）

// ReadingCore-01 keepout 尺寸（需与 readingcore-01-keepout.scad 一致）
core_length = 320;
core_width  =  24;
core_height =  12;
diffuser_height = 4;
keepout_width  = core_width + 2 * 0.5;
keepout_height = core_height + diffuser_height + 0.5;
keepout_length = core_length + 2 * 0.5;

// 安全间隙：外壳内壁与 keepout 至少保留 2mm
clearance = 2;

module readingcore_keepout() {
    color("DarkOrange", 0.35)
        translate([0, 0, core_height/2 + diffuser_height/2])
            cube([keepout_length, keepout_width, keepout_height], center=true);
}

module diffuser_slot() {
    color("LightBlue", 0.3)
        translate([0, 0, core_height/2 + diffuser_height/2])
            cube([keepout_length + 4, keepout_width + 2, diffuser_height + 0.5], center=true);
}

module m3_mount_holes() {
    mount_hole_diameter = 3.2;
    mount_hole_spacing  = 300;
    for (x = [-mount_hole_spacing/2, mount_hole_spacing/2]) {
        translate([x, 0, core_height + diffuser_height + 2])
            color("Red", 0.6)
                cylinder(h = 10, d = mount_hole_diameter, $fn = 24, center = true);
    }
}

module cable_exit() {
    color("Yellow", 0.5)
        translate([core_length/2 + 8, 0, core_height/2])
            cylinder(h = 12, d = 8, $fn = 24, center = true);
}

module shell_hutong_window() {
    difference() {
        // 主体：长条盒 + 屋檐顶
        union() {
            // 主盒体
            translate([0, 0, shell_height/2])
                cube([shell_length, shell_width, shell_height], center=true);

            // 中式屋檐：顶部两侧小檐口
            translate([0, 0, shell_height])
                scale([1, 1.15, 1])
                    linear_extrude(height = 4, center = true)
                        polygon([
                            [-shell_length/2 - 4, 0],
                            [shell_length/2 + 4, 0],
                            [shell_length/2, -shell_width/2 - 4],
                            [-shell_length/2, -shell_width/2 - 4]
                        ]);
        }

        // 内部挖空：灯腔（避让 ReadingCore-01 keepout）
        translate([0, 0, keepout_height/2 + clearance])
            cube([keepout_length + 2*clearance, keepout_width + 2*clearance, keepout_height + 2*clearance], center=true);

        // 底部开口：让光射出
        translate([0, 0, -0.5])
            cube([keepout_length, keepout_width, wall_thickness + 1], center=true);

        // 窗棂格栅：在两侧面挖出规则矩形
        for (i = [0 : window_count - 1]) {
            x_pos = -shell_length/2 + wall_thickness + (i + 0.5) * ((shell_length - 2*wall_thickness) / window_count);
            cut_w = ((shell_length - 2*wall_thickness) / window_count) * cutout_ratio;
            cut_h = shell_height * 0.55;

            // 左侧面窗格
            translate([x_pos, -shell_width/2 - 0.1, shell_height/2])
                cube([cut_w, wall_thickness + 0.2, cut_h], center=true);

            // 右侧面窗格
            translate([x_pos, shell_width/2 + 0.1, shell_height/2])
                cube([cut_w, wall_thickness + 0.2, cut_h], center=true);
        }
    }

    // 装配定位筋（示意，用于外壳与散热铝槽对齐）
    color("Silver", 0.6) {
        for (x = [-keepout_length/2, keepout_length/2]) {
            translate([x, 0, keepout_height/2 + clearance])
                cube([2, keepout_width + 2*clearance, 1], center=true);
        }
    }
}

// 最终调用：渲染外壳，并叠加 keepout 作为参考
difference() {
    shell_hutong_window();
    readingcore_keepout();
}

// 使用示例：
//   openscad -D shell_length=300 -D window_count=4 -o sample-hutong-window-shell.stl sample-hutong-window-shell.scad
